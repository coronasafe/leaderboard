import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { Activity, ActivityData, Contributor, Highlights } from "./types";
import { padZero } from "./utils";

const root = join(process.cwd(), "contributors");
const slackRoot = join(process.cwd(), "data/slack");
const githubRoot = join(process.cwd(), "data/github");

const points = {
  comment_created: 1,
  issue_assigned: 1,
  pr_reviewed: 4,
  issue_opened: 4,
  eod_update: 2,
  pr_opened: 1,
  pr_merged: 7,
  pr_collaborated: 2,
  issue_closed: 0,
};
// Comments will get a single point
// Picking up an issue would get a point
// Reviewing a PR would get 4 points
// Finding a bug would add up to 4 points
// Opening a PR would give a single point and merging it would give you the other 7 points, making 8 per PR
// Updating the EOD would get 2 points per day and additional 20 for regular daily updates plus 10 for just missing one

export function formatSlug(slug: string) {
  return slug.replace(/\.md$/, "");
}

export function formatSlugJSON(slug: string) {
  return slug.replace(/\.json$/, "");
}

export function getSlackSlugs() {
  const slackSlugs: Record<string, string> = {};
  fs.readdirSync(`${slackRoot}`).forEach((file) => {
    slackSlugs[formatSlugJSON(file)] = file;
  });

  return slackSlugs;
}

let validSlackSlugs = getSlackSlugs();

export function getSlackMessages(slackId: string) {
  const filePath = join(slackRoot, `${slackId}.json`);
  let fileContents = [];
  if (validSlackSlugs[slackId]) {
    try {
      fileContents = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      console.log(e);
    }
    return Object.values(fileContents).reduce(
      (acc: Activity[], messages: any) => {
        return acc.concat(
          messages.map((message: any) => ({
            type: "eod_update",
            time: new Date(message.ts * 1000).toISOString(),
            link: "",
            text: message.text,
          })),
        );
      },
      [],
    );
  } else {
    return [] as Activity[];
  }
}

export function getContributorsSlugs() {
  const contributorSlugs: { file: string }[] = [];
  fs.readdirSync(`${root}`).forEach((file) => {
    contributorSlugs.push({ file: file });
  });

  return contributorSlugs;
}

export function getContributorBySlug(file: string, detail = false) {
  const fullPath = join(root, `${formatSlug(file)}.md`);
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));

  const githubHandle = file.replace(/\.md$/, "");

  let activityData = { activity: [] as Activity[] } as ActivityData;

  try {
    activityData = JSON.parse(
      fs.readFileSync(join(githubRoot, `${githubHandle}.json`), "utf8"),
    );
  } catch (e) {
    console.log(e);
  }

  activityData = {
    ...activityData,
    activity: [...activityData.activity, ...getSlackMessages(data.slack)],
  };
  let AllUnqPrReviews = new Set();

  let weightedActivity = activityData.activity.reduce(
    (acc, activity) => {
      if (activity.type == "pr_reviewed") {
        AllUnqPrReviews.add(activity.title);
      }

      return {
        activity: [
          ...acc.activity,
          { ...activity, points: points[activity.type] || 0 },
        ],
        points: acc.points + (points[activity.type] || 0),
        comment_created:
          acc.comment_created + (activity.type === "comment_created" ? 1 : 0),
        eod_update: acc.eod_update + (activity.type === "eod_update" ? 1 : 0),
        pr_opened: acc.pr_opened + (activity.type === "pr_opened" ? 1 : 0),
        pr_merged: acc.pr_merged + (activity.type === "pr_merged" ? 1 : 0),
        pr_collaborated:
          acc.pr_collaborated + (activity.type === "pr_collaborated" ? 1 : 0),
        pr_reviewed: 0,
        issue_assigned:
          acc.issue_assigned + (activity.type === "issue_assigned" ? 1 : 0),
        issue_opened:
          acc.issue_opened + (activity.type === "issue_opened" ? 1 : 0),
      };
    },
    {
      activity: [],
      points: 0,
      comment_created: 0,
      eod_update: 0,
      pr_opened: 0,
      pr_merged: 0,
      pr_collaborated: 0,
      pr_reviewed: 0,
      issue_assigned: 0,
      issue_opened: 0,
    } as Highlights & { activity: Activity[] },
  );

  weightedActivity.pr_reviewed = AllUnqPrReviews.size;

  const calendarData = getCalendarData(weightedActivity.activity);

  const summarize = (start: Date, end: Date) => {
    return calendarData
      .filter((day) => {
        const date = new Date(day.date);
        return start <= date && date <= end;
      })
      .reduce(HighlightsReducer, HighlightsInitialValue) as Highlights;
  };

  return {
    file: file,
    slug: formatSlug(file),
    path: fullPath,
    content: content,
    activityData: {
      ...activityData,
      activity: weightedActivity.activity,
      pr_stale: activityData.open_prs.reduce(
        (acc, pr) => (pr?.stale_for >= 7 ? acc + 1 : acc),
        0,
      ),
    },
    highlights: {
      points: weightedActivity.points,
      eod_update: weightedActivity.eod_update,
      comment_created: weightedActivity.comment_created,
      pr_opened: weightedActivity.pr_opened,
      pr_reviewed: weightedActivity.pr_reviewed,
      pr_merged: weightedActivity.pr_merged,
      pr_collaborated: weightedActivity.pr_collaborated,
      issue_assigned: weightedActivity.issue_assigned,
      issue_opened: weightedActivity.issue_opened,
    },
    weekSummary: getLastWeekHighlights(calendarData),
    summarize,
    calendarData: detail ? calendarData : [],
    ...data,
  } as Contributor & { summarize: typeof summarize };
}

export function getContributors(detail = false) {
  return getContributorsSlugs().map((path) =>
    getContributorBySlug(path.file, detail),
  );
}

export function getCalendarData(activity: Activity[]) {
  const calendarData = activity.reduce(
    (acc, activity) => {
      // Github activity.time ignores milliseconds (*1000)
      const date = (
        new String(activity.time).length === 10
          ? new Date(activity.time * 1000)
          : new Date(activity.time.toString().slice(0, 10))
      )
        .toISOString()
        .split("T")[0];
      if (!acc[date]) {
        acc[date] = {
          count: 0,
          types: [],
        };
      }
      acc[date].count += 1;

      const uniquePrReviews = new Set();

      if (acc[date][activity.type]) {
        if (
          activity.type != "pr_reviewed" ||
          (activity.type == "pr_reviewed" &&
            uniquePrReviews.has(activity.title))
        ) {
          acc[date][activity.type] += 1;
          
        }
      } else {
        if (
          activity.type != "pr_reviewed" ||
          (activity.type == "pr_reviewed" &&
            !uniquePrReviews.has(activity.title))
        ) {
          acc[date][activity.type] = 1;
          uniquePrReviews.add(activity.title);
        }
      }
      if (!acc[date].types.includes(activity.type)) {
        acc[date].types.push(activity.type);
        // console.log(activity.type);
      }
      return acc;
    },
    {} as Record<string, any>,
  );
  return [...Array(365)].map((_, i) => {
    // Current Date - i
    const iReverse = 365 - i;
    const date = new Date(
      new Date().getTime() - iReverse * 24 * 60 * 60 * 1000,
    );
    // yyyy-mm-dd
    const dateString = `${date.getFullYear()}-${padZero(
      date.getMonth() + 1,
    )}-${padZero(date.getDate())}`;
    const returnable = {
      // date in format YYYY-MM-DD
      ...calendarData[dateString],
      date: dateString,
      count: calendarData[dateString]?.count || 0,
      level: Math.min(calendarData[dateString]?.types.length || 0, 4),
    };
    // console.log("Returning", returnable);
    return returnable;
  });
}

const HIGHLIGHT_KEYS = [
  "eod_update",
  "comment_created",
  "pr_opened",
  "pr_reviewed",
  "pr_merged",
  "pr_collaborated",
  "issue_assigned",
  "issue_opened",
] as const;

const computePoints = (
  calendarDataEntry: Highlights,
  initialPoints: number,
) => {
  return HIGHLIGHT_KEYS.map(
    (key) => points[key] * (calendarDataEntry[key] ?? 0),
  ).reduce((a, b) => a + b, initialPoints);
};

const HighlightsReducer = (acc: Highlights, day: Highlights) => {
  return {
    points: computePoints(day, acc.points),
    eod_update: acc.eod_update + (day.eod_update ?? 0),
    comment_created: acc.comment_created + (day.comment_created ?? 0),
    pr_opened: acc.pr_opened + (day.pr_opened ?? 0),
    pr_reviewed: acc.pr_reviewed + (day.pr_reviewed ?? 0),
    pr_merged: acc.pr_merged + (day.pr_merged ?? 0),
    pr_collaborated: acc.pr_collaborated + (day.pr_collaborated ?? 0),
    issue_assigned: acc.issue_assigned + (day.issue_assigned ?? 0),
    issue_opened: acc.issue_opened + (day.issue_opened ?? 0),
  };
};

const HighlightsInitialValue = {
  points: 0,
  eod_update: 0,
  comment_created: 0,
  pr_opened: 0,
  pr_reviewed: 0,
  pr_merged: 0,
  pr_collaborated: 0,
  issue_assigned: 0,
  issue_opened: 0,
} as Highlights;

const getLastWeekHighlights = (calendarData: Highlights[]) => {
  const lastWeek = calendarData.slice(-7);
  const highlights = lastWeek.reduce(HighlightsReducer, HighlightsInitialValue);

  if (highlights.eod_update == 7) {
    highlights.points += 20;
  }
  if (highlights.eod_update == 6) {
    highlights.points += 10;
  }

  return highlights;
};
