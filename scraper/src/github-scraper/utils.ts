import path from "path";
import { octokit } from "./config.js";
import { Action, ActivityData, PullRequestEvent } from "./types.js";
import { promises as fs } from "fs";


export const parseISODate = (isoDate: Date) => {
  return new Date(isoDate);
};

const userBlacklist = new Set(["dependabot", "snyk-bot", "codecov-commenter"]);

export const isBlacklisted = (login: string): boolean => {
  return login.includes("[bot]") || userBlacklist.has(login);
};

export async function calculateTurnaroundTime(event: PullRequestEvent) {
  const user: string = event.payload.pull_request.user.login;
  const mergedAt: Date = parseISODate(event.payload.pull_request.merged_at);
  const createdAt: Date = parseISODate(event.payload.pull_request.created_at);

  const linkedIssues: [string, string][] = [];
  const body = event.payload.pull_request.body || "";
  const regex =
    /(fix|fixes|fixed|close|closes|closed|resolve|resolves|resolved) ([\w\/.-]*)(#\d+)/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(body)) !== null) {
    linkedIssues.push([match[2], match[3]]);
  }

  const prTimelineResponse = await octokit.request(
    `GET ${event.payload?.pull_request?.issue_url}/timeline`,
  );

  const prTimeline = prTimelineResponse.data;

  prTimeline.forEach((action: Action) => {
    if (
      action.event === "cross-referenced" &&
      action.source.type === "issue" &&
      !action.source.issue.pull_request
    ) {
      linkedIssues.push([
        action.source.issue.repository.full_name,
        `#${action.source.issue.number}`,
      ]);
    }

    if (action.event === "connected") {
      // TODO: currently there is no way to get the issue number from the timeline, handle this case while moving to graphql
    }
  });
  const uniqueLinkedIssues: [string, string][] = Array.from(
    new Set(linkedIssues.map((issue) => JSON.stringify(issue))),
  ).map((item) => JSON.parse(item) as [string, string]);
  const assignedAts: { issue: string; time: Date }[] = [];

  for (const [org_repo, issue] of uniqueLinkedIssues) {
    const org = org_repo.split("/")[0] || event.repo.name.split("/")[0];
    const repo = org_repo.split("/")[-1] || event.repo.name.split("/")[1];
    const issueNumber = parseInt(issue.split("#")[1]);

    const issueTimelineResponse = await octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue_number}/timeline",
      {
        owner: org,
        repo: repo,
        issue_number: issueNumber,
      },
    );

    const issueTimeline = issueTimelineResponse.data;
    issueTimeline.forEach((action: Action) => {
      if (action.event === "assigned" && action.assignee.login === user) {
        assignedAts.push({
          issue: `${org}/${repo}#${issueNumber}`,
          time: parseISODate(action.created_at),
        });
      }

      if (action.event === "unassigned" && action.assignee.login === user) {
        assignedAts.pop();
      }
    });
  }

  const assignedAt: Date | null =
    assignedAts.length === 0
      ? null
      : assignedAts.reduce((min, current) =>
        current.time < min.time ? current : min,
      ).time;
  const turnaroundTime =
    (mergedAt.getTime() - (assignedAt || createdAt.getTime()).valueOf()) / 1000;
  return turnaroundTime;
}

export async function resolve_autonomy_responsibility(
  event: Action,
  user: string,
) {
  if (event.event === "cross-referenced" && event.source.type === "issue") {
    return event.source.issue.user.login === user;
  }
  return false;
}

export async function loadUserData(user: string, dataDir: string) {
  const file = path.join(dataDir, `${user}.json`);
  console.log(`Loading user data from ${file}`);

  try {
    const response = await fs.readFile(file);
    const data: ActivityData = JSON.parse(response.toString());
    return data;
  } catch (error: any) {
    if (error.code === "ENOENT" || error.name === "SyntaxError") {
      console.log(`User data not found for ${user}`);
      return { activity: [] };
    } else {
      throw error; // rethrow unexpected errors
    }
  }
}

export async function saveUserData(
  user: string,
  data: ActivityData,
  dataDir: string,
  serializer: any,
) {
  const file = path.join(dataDir, `${user}.json`);
  console.log(`Saving user data to ${file}`);

  try {
    const jsonData = JSON.stringify(data, serializer, 2);
    await fs.writeFile(file, jsonData);
  } catch (error: any) {
    console.error(`Failed to save user data for ${user}: ${error.message}`);
    throw error;
  }
}
