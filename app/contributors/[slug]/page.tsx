import {
  advancedSkills,
  humanValues,
  professionalSelfSkills,
  professionalTeamSkills,
  resolveGraduateAttributes,
} from "../../../config/GraduateAttributes";
import { getContributorBySlug, getContributorsSlugs } from "../../../lib/api";
import ActivityCalendarGit from "../../../components/contributors/ActivityCalendarGitHub";
import BadgeIcons from "../../../components/contributors/BadgeIcons";
import GithubActivity from "../../../components/contributors/GithubActivity";
import GraduateAttributeBadge from "../../../components/contributors/GraduateAttributeBadge";
import InfoCard from "../../../components/contributors/InfoCard";
import React, { Suspense } from "react";
import clsx from "clsx";
import { Contributor } from "@/lib/types";
import { formatDuration } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import { FiAlertTriangle } from "react-icons/fi";
import { TbGitPullRequest } from "react-icons/tb";
import RelativeTime from "@/components/RelativeTime";
import Link from "next/link";
import { env } from "@/env.mjs";

export async function generateStaticParams() {
  const slugs = await getContributorsSlugs();
  return slugs
    .filter((slug) => !slug.file.includes("[bot]"))
    .map((slug) => ({ slug: slug.file.replace(".md", "") }));
}

export const dynamicParams = false;

type Params = {
  params: { slug: string };
};

export default async function Contributor({ params }: Params) {
  const { slug } = params;
  const contributor = await getContributorBySlug(slug, true);

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      <div className="border-b border-gray-300 bg-gray-200/50 pb-3 pt-2 shadow-md dark:border-gray-700 dark:bg-gray-700/50">
        <h1 className="mx-auto max-w-6xl text-center text-sm text-gray-600 dark:text-gray-400 md:text-xl">
          Personal Learning Dashboard (Beta)
        </h1>
      </div>
      <section className="bg-gray-200 px-4 py-8 dark:bg-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col md:flex-row ">
          <div className="md:w-2/3">
            <InfoCard contributor={contributor} />
          </div>
          <div className="mt-6 flex w-full gap-2 overflow-x-auto md:mt-0 md:grid md:grid-cols-7 md:overflow-x-visible">
            {[
              professionalSelfSkills,
              professionalTeamSkills,
              advancedSkills,
              humanValues,
            ].map((attributeGroup) => {
              return attributeGroup.map((skill) => (
                <div
                  className="flex shrink-0 items-center justify-center rounded-lg"
                  key={skill.key}
                >
                  <BadgeIcons
                    skill={resolveGraduateAttributes(skill, contributor)}
                  />
                </div>
              ));
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-16 pt-6">
        {contributor.content.includes("Still waiting for this") && (
          <div className="mt-10 flex justify-between rounded-lg border border-current bg-amber-300/20 px-6 py-4 font-semibold text-amber-500 dark:bg-amber-500/20 xl:px-10">
            <span className="flex items-center gap-4">
              <FiAlertTriangle size={20} />
              Contributor profile has not been updated.
            </span>
            <Link
              href={`https://github.com/${env.NEXT_PUBLIC_GITHUB_ORG}/leaderboard-data/edit/main/contributors/${contributor.github}.md`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-3 py-2 font-bold text-white transition-all duration-200 ease-in-out hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
            >
              <TbGitPullRequest />
              Update Profile
            </Link>
          </div>
        )}

        <div className="pl-4 md:p-0">
          <div className="mt-8 flex items-end justify-between">
            <h3 className="font-bold text-foreground">Graduate Attributes</h3>
            <Link
              href="#"
              className="mt-1 inline-flex items-center space-x-2 pl-1 pt-2 text-gray-400 underline transition hover:text-primary-400"
            >
              <span>Learn More</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="h-5 w-5"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z" />
                </svg>
              </span>
            </Link>
          </div>
          <div className="mt-3">
            <div className="flex w-full space-x-6 overflow-x-auto md:grid md:grid-cols-2 md:space-x-0">
              <div className="flex w-3/4 shrink-0 flex-col rounded-tl-lg bg-gray-200 pb-2 dark:bg-gray-800 md:w-auto md:justify-between md:pr-2">
                <div className="flex items-center rounded-t-lg bg-gray-300 p-3 dark:bg-gray-700 md:justify-center">
                  <p className="font-semibold text-foreground md:text-lg">
                    Individual Skills
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 py-2 pl-2 md:flex-row-reverse">
                  {professionalSelfSkills.map((skill) => (
                    <GraduateAttributeBadge
                      skill={resolveGraduateAttributes(skill, contributor)}
                      key={skill.key}
                      color={"bg-green-600"}
                      colorDark={"bg-green-700"}
                    />
                  ))}
                </div>
              </div>
              <div className="flex w-3/4 shrink-0 flex-col rounded-tr-lg bg-gray-200 pb-2 dark:bg-gray-800 md:w-auto md:justify-between md:border-l-4 md:border-indigo-700 md:pl-2">
                <div className="flex items-center rounded-t-lg bg-gray-300 p-3 dark:bg-gray-700 md:justify-center">
                  <p className="font-semibold text-foreground md:text-lg">
                    Team Skills
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 py-2 pl-2 md:pl-0 md:pr-2">
                  {professionalTeamSkills.map((skill) => (
                    <GraduateAttributeBadge
                      skill={resolveGraduateAttributes(skill, contributor)}
                      key={skill.key}
                      color={"bg-indigo-500"}
                      colorDark={"bg-indigo-700"}
                    />
                  ))}
                </div>
              </div>
              <div className="flex w-3/4 shrink-0 flex-col-reverse justify-end rounded-bl-lg bg-gray-200 dark:bg-gray-800 md:w-auto md:flex-col md:justify-between md:border-t-4 md:border-indigo-700 md:pr-2 md:pt-2">
                <div className="flex flex-wrap gap-2 py-2 pl-2 pr-2 leading-tight md:flex-row-reverse md:pr-0">
                  {advancedSkills.map((skill) => (
                    <GraduateAttributeBadge
                      skill={resolveGraduateAttributes(skill, contributor)}
                      key={skill.key}
                      color={"bg-orange-500"}
                      colorDark={"bg-orange-700"}
                    />
                  ))}
                </div>
                <div className="flex items-center rounded-b-lg bg-gray-300 p-3 dark:bg-gray-700 md:justify-center ">
                  <p className="font-semibold text-foreground md:text-lg">
                    Advanced Skills
                  </p>
                </div>
              </div>
              <div className="flex w-3/4 shrink-0 flex-col-reverse justify-end rounded-br-lg bg-gray-200 dark:bg-gray-800 md:w-auto md:flex-col md:justify-between md:border-l-4 md:border-t-4 md:border-indigo-700 md:pl-2 md:pt-2">
                <div className="flex flex-wrap gap-2 py-2 pl-2 pr-2 md:pl-0">
                  {humanValues.map((skill) => (
                    <GraduateAttributeBadge
                      skill={resolveGraduateAttributes(skill, contributor)}
                      key={skill.key}
                      color={"bg-rose-500"}
                      colorDark={"bg-rose-700"}
                    />
                  ))}
                </div>
                <div className="flex items-center bg-gray-300 p-3 dark:bg-gray-700 md:justify-center md:rounded-b-lg">
                  <p className="font-semibold text-foreground md:text-lg">
                    Cultural Skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:p-0">
          <div className="flex items-center justify-between">
            <h3 className="my-4 font-bold text-foreground">Short Bio</h3>
            <Link
              href={`https://github.com/${env.NEXT_PUBLIC_GITHUB_ORG}/leaderboard-data/edit/main/contributors/${contributor.github}.md`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-gray-500 underline underline-offset-2 dark:text-gray-300"
            >
              <TbGitPullRequest />
              Update
            </Link>
          </div>
          <div className="w-full rounded-lg bg-gray-100 dark:bg-gray-800 ">
            <div className="rounded-lg px-6 py-10 xl:px-10">
              <Markdown>{contributor.content}</Markdown>
            </div>
          </div>
        </div>

        <div className="px-4 md:p-0">
          <h3 className="my-4 font-bold text-foreground">Learning Activity</h3>
          <ActivityCalendarGit calendarData={contributor.calendarData} />
        </div>
        <div className="px-4 md:p-0">
          <h3 className="mt-6 font-bold text-foreground">Highlights</h3>
          <dl className="mt-4 text-center sm:mx-auto sm:grid sm:max-w-3xl sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-3 mt-2 text-lg font-medium leading-6 text-primary-300">
                Pull Request
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-foreground">
                {contributor.highlights.pr_opened}
              </dd>
              <p className="order-2 text-xl text-gray-400">
                <b className="text-foreground">
                  {contributor.weekSummary.pr_opened}
                </b>{" "}
                in last 7 days
              </p>
            </div>
            <div className="mt-4 flex flex-col sm:mt-0">
              <dt className="order-3 mt-2 text-lg font-medium leading-6 text-primary-300">
                Reviews
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-foreground">
                {contributor.highlights.pr_reviewed}
              </dd>
              <p className="order-2 text-xl text-gray-400">
                <b className="text-foreground">
                  {contributor.weekSummary.pr_reviewed}
                </b>{" "}
                in last 7 days
              </p>
            </div>
            <div className="mt-4 flex flex-col sm:mt-0">
              <dt className="order-3 mt-2 text-lg font-medium leading-6 text-primary-300">
                Feed
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-foreground">
                {contributor.highlights.eod_update}
              </dd>
              <p className="order-2 text-xl text-gray-400">
                <b className="text-foreground">
                  {contributor.weekSummary.eod_update}
                </b>{" "}
                in last 7 days
              </p>
            </div>
            <div className="col-span-3 flex flex-col">
              <dt className="order-2 mt-2 text-lg font-medium leading-6 text-primary-300">
                Avg. PR Turnaround Time
              </dt>
              <dd className="order-1 truncate whitespace-nowrap text-5xl font-extrabold text-foreground">
                {formatDuration(
                  (contributor.activityData?.activity
                    .map((act) => act.turnaround_time)
                    .filter(Boolean)
                    .reduce(
                      (acc, curr, i, array) => acc! + curr! / array.length,
                      0,
                    ) || 0) * 1000,
                ) || (
                  <span className="text-lg font-bold text-gray-500">
                    <p>N/A</p>
                    <p>Yet to make contributions!</p>
                  </span>
                )}
              </dd>
            </div>
            {/* <div className="flex flex-col mt-4 sm:mt-0">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                    Points
                  </dt>
                  <dd className="order-1 text-5xl font-extrabold text-white">
                    {contributor.highlights.points}
                  </dd>
                </div> */}
          </dl>
        </div>

        {contributor["activityData"] &&
          contributor["activityData"]["open_prs"] &&
          contributor["activityData"]["open_prs"].length > 0 && (
            <div className="px-4 md:p-0">
              <h3 className="mt-6 font-bold text-foreground">
                Currently Working on
              </h3>
              <div className="mt-4">
                {contributor["activityData"]["open_prs"].map((pr, index) => (
                  <Link href={pr.link} key={index} className="flex gap-2">
                    <div className="tooltip">
                      {((pr?.stale_for >= 7) as Boolean) && (
                        <span className="tooltip-text tooltip-bottom mr-auto">
                          Stale for {pr?.stale_for} days
                        </span>
                      )}
                      <p
                        className={clsx(
                          "mb-2 flex gap-2 text-sm transition-colors duration-75 ease-in-out",
                          pr?.stale_for >= 7
                            ? "text-gray-700 hover:text-primary-400 dark:text-gray-600 dark:hover:text-primary-200"
                            : "text-gray-400 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-300",
                        )}
                        key={index}
                      >
                        <span className="flex items-center">
                          <span className="pr-2 text-sm text-primary-500">
                            ➞
                          </span>
                          <code
                            className={clsx(
                              "mr-2 rounded px-1.5 py-1 text-xs",
                              pr.stale_for >= 7
                                ? "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-600"
                                : "bg-gray-100 text-gray-400 dark:bg-gray-600 dark:text-white",
                            )}
                          >
                            {pr.link
                              .split("/")
                              .slice(-3)
                              .join("/")
                              .replace("/pull", "")}
                          </code>
                          {pr.title}
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        {contributor["activityData"] &&
          contributor["activityData"]["activity"] && (
            <div className="mt-6 px-4 md:p-0">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-foreground">Contributions</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Last contribution{" "}
                  {contributor.activityData.last_updated ? (
                    <RelativeTime
                      time={contributor.activityData.last_updated * 1e3}
                    />
                  ) : (
                    "unknown"
                  )}
                </span>
              </div>
              <GithubActivity activityData={contributor["activityData"]} />
            </div>
          )}
      </div>
    </div>
  );
}
