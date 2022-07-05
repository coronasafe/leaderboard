import React from "react";
import markdownToHtml from "../../lib/markdownToHtml";
import Head from "next/head";

import InfoCard from "../../components/contributors/InfoCard";
import GithubActivity from "../../components/contributors/GithubActivity";
import BadgeIcons from "../../components/contributors/BadgeIcons";
import GraduateAttributeBadge from "../../components/contributors/GraduateAttributeBadge";
import {
  professionalSelfSkills,
  professionalTeamSkills,
  advancedSkills,
  humanValues,
  resolveGraduateAttributes,
} from "../../config/GraduateAttributes";

import { getContributorBySlug, getContributors } from "../../lib/api";
import Link from "next/link";

import ActivityCalendar from "react-activity-calendar";
import PageHead from "../../components/PageHead";
import Header from "../../components/Header";
// export function defaultCalendarData() {
//   return [...Array(365)].map((_, i) => {
//     // Current Date - i
//     const iReverse = 365 - i;
//     const date = new Date(
//       new Date().getTime() - iReverse * 24 * 60 * 60 * 1000
//     );
//     return {
//       date: date.toISOString(),
//       count: 0,
//       level: 0,
//     };
//   });
// }

export default function Contributor({ contributor, slug }) {
  // const md_content = xss(marked.parse(contributor.content));

  return (
    <div className="bg-gray-900 min-h-screen">
      <PageHead title={contributor.name} />
      {/* <Header /> */}
      <section className="px-4 py-8 bg-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row ">
          <div className="md:w-2/3">
            <InfoCard contributor={contributor} />
          </div>
          <div className="flex md:grid md:grid-cols-7 mt-6 md:mt-0 w-full overflow-x-auto gap-2">
            {professionalSelfSkills.map((skill) => (
              <div
                className="p-1 flex items-center justify-center flex-shrink-0 bg-gray-900 bg-opacity-40 rounded-lg"
                key={skill.key}
              >
                <BadgeIcons
                  skill={resolveGraduateAttributes(skill, contributor)}
                />
              </div>
            ))}
            {professionalTeamSkills.map((skill) => (
              <div
                className="p-1 flex items-center justify-center flex-shrink-0 bg-gray-900 bg-opacity-40 rounded-lg"
                key={skill.key}
              >
                <BadgeIcons
                  skill={resolveGraduateAttributes(skill, contributor)}
                />
              </div>
            ))}
            {advancedSkills.map((skill) => (
              <div
                className="p-1 flex items-center justify-center flex-shrink-0 bg-gray-900 bg-opacity-40 rounded-lg"
                key={skill.key}
              >
                <BadgeIcons
                  skill={resolveGraduateAttributes(skill, contributor)}
                />
              </div>
            ))}
            {humanValues.map((skill) => (
              <div
                className="p-1 flex items-center justify-center flex-shrink-0 bg-gray-900 bg-opacity-40 rounded-lg"
                key={skill.key}
              >
                <BadgeIcons
                  skill={resolveGraduateAttributes(skill, contributor)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto space-y-16">
        <div className="pl-4 md:p-0">
          <h3 className="font-bold text-gray-100 mt-14">Graduate Attributes</h3>
          <div className="bg-gray-900 mt-3">
            <div className="flex space-x-6 md:space-x-0 overflow-x-auto w-full md:grid md:grid-cols-2">
              <div className="md:pr-2 pb-2 bg-gray-800 flex flex-col md:justify-between flex-shrink-0 w-3/4 md:w-auto">
                <div className="flex items-center md:justify-center p-3 bg-gray-700 rounded-t-lg">
                  <p className="text-white md:text-lg font-semibold">
                    Individual Skills
                  </p>
                </div>
                <div className="flex flex-wrap md:flex-row-reverse py-2 pl-2 gap-2">
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
              <div className="md:pl-2 pb-2 md:border-l-4 md:border-indigo-700 bg-gray-800 flex flex-col md:justify-between flex-shrink-0 w-3/4 md:w-auto">
                <div className="flex items-center md:justify-center p-3 bg-gray-700 rounded-t-lg">
                  <p className="text-white md:text-lg font-semibold">
                    Team Skills
                  </p>
                </div>
                <div className="flex flex-wrap py-2 pl-2 md:pl-0 md:pr-2 gap-2">
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
              <div className="md:pr-2 md:pt-2 md:border-t-4 md:border-indigo-700 bg-gray-800 flex flex-col-reverse md:flex-col justify-end md:justify-between flex-shrink-0 w-3/4 md:w-auto">
                <div className="flex flex-wrap md:flex-row-reverse py-2 pl-2 pr-2 md:pr-0 gap-2 leading-tight">
                  {advancedSkills.map((skill) => (
                    <GraduateAttributeBadge
                      skill={resolveGraduateAttributes(skill, contributor)}
                      key={skill.key}
                      color={"bg-orange-500"}
                      colorDark={"bg-orange-700"}
                    />
                  ))}
                </div>
                <div className="flex items-center md:justify-center p-3 bg-gray-700 rounded-b-lg ">
                  <p className="text-white md:text-lg font-semibold">
                    Advanced Skills
                  </p>
                </div>
              </div>
              <div className="md:pt-2 md:pl-2 md:border-t-4 md:border-l-4 md:border-indigo-700 bg-gray-800 flex flex-col-reverse md:flex-col justify-end md:justify-between flex-shrink-0 w-3/4 md:w-auto">
                <div className="flex flex-wrap py-2 pl-2 md:pl-0 pr-2 gap-2">
                  {humanValues.map((skill) => (
                    <GraduateAttributeBadge
                      skill={resolveGraduateAttributes(skill, contributor)}
                      key={skill.key}
                      color={"bg-rose-500"}
                      colorDark={"bg-rose-700"}
                    />
                  ))}
                </div>
                <div className="flex items-center md:justify-center p-3 bg-gray-700 rounded-t-lg md:rounded-b-lg">
                  <p className="text-white md:text-lg font-semibold">
                    Cultural Skills
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:p-0">
          {contributor.courses_completed && (
            <div>
              <h3 className="font-bold text-gray-100 mt-4">Journey Map</h3>
              <div className="journey-map__container relative bg-gray-800 text-center rounded-lg px-4 py-8 sm:px-8 xl:text-left mt-4">
                <div className="flex flex-col md:flex-row overflow-x-auto md:space-y-0 md:space-x-4 font-semibold">
                  {contributor.courses_completed.map((course) => (
                    <div
                      key={course}
                      className="relative flex flex-col items-center justify-center"
                    >
                      <div className="journey-map__milestone relative z-10 p-2 w-24 h-24 bg-gray-600 rounded-full flex items-center text-center shadow-xl"></div>
                      <p className="text-sm text-center text-gray-300 mt-2 z-10 bg-gray-800 py-0.5">
                        {course}
                      </p>
                      <div className="absolute top-12 z-20">
                        <img
                          className="mx-auto h-9 w-9"
                          src="/images/map-check.png"
                        ></img>
                      </div>
                    </div>
                  ))}

                  <div className="relative  flex flex-col items-center juustify-center">
                    <div className="relative journey-map__milestone z-10 p-2 w-24 h-24 bg-gray-600 rounded-full flex items-center text-center shadow-xl"></div>
                    <p className="text-sm text-center text-gray-300 mt-2 z-10 bg-gray-800 py-0.5">
                      Teaching Assistant &amp; Internship
                    </p>
                    <div className="absolute top-8 md:top-5 animate-bounce z-20 flex items-center justify-center">
                      <img
                        className="mx-auto w-14 md:w-16"
                        src="/images/map-pointer.png"
                      ></img>
                      <img
                        className="absolute top-1.5 mx-auto h-7 md:h-8 w-7 md:w-8 rounded-full border border-primary-200"
                        src={`https://github.com/${contributor.github}.png`}
                        alt={contributor.github}
                      />
                    </div>
                  </div>
                  <div className="relative flex flex-col items-center juustify-center">
                    <div className="relative journey-map__milestone z-10 p-2 w-24 h-24 bg-gray-600 rounded-full flex items-center text-center shadow-xl"></div>
                    <p className="text-sm text-center text-gray-300 mt-2 z-10 bg-gray-800 py-0.5">
                      Industry Placement
                    </p>
                  </div>
                </div>
                <div className="w-2.5 md:w-auto md:h-2.5 absolute bg-gray-900 top-24 bottom-20 left-1/2 transform -translate-x-1/2 md:-translate-x-0 md:left-20 md:right-20 z-1 md:bottom-24 mt-5"></div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 md:p-0">
          <h3 className="font-bold text-gray-100 my-4">Short Bio</h3>
          <div className="bg-gray-800 w-full rounded-lg ">
            <div
              className="prose prose-invert py-10 px-6 rounded-lg xl:px-10 xl:text-left leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: contributor.content,
              }}
            ></div>
          </div>
        </div>

        <div className="px-4 md:p-0">
          <h3 className="font-bold text-gray-100 mt-4">Learning Activity</h3>
          <div className="p-2 py-8 bg-white text-center rounded-lg px-6 sm:px-10 xl:text-left mt-4">
            {/* <p className="text-xl text-gray-300">
                  ...to add activity visualization...
                </p> */}

            <ActivityCalendar
              showWeekdayLabels
              data={contributor.calendarData}
            />
          </div>
        </div>
        <div className="px-4 md:p-0">
          <h3 className="font-bold text-gray-100 mt-6">Highlights</h3>
          <dl className="mt-4 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Pull Request
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {contributor.highlights.pr_opened}
              </dd>
            </div>
            <div className="flex flex-col mt-4 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Reviews
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {contributor.highlights.pr_reviewed}
              </dd>
            </div>
            <div className="flex flex-col mt-4 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-primary-200">
                Feed
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {contributor.highlights.eod_update}
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
              <h3 className="font-bold text-gray-100 mt-6">
                Currently Working on
              </h3>
              <div className="mt-4">
                {contributor["activityData"]["open_prs"].map((pr, index) => (
                  <a href={pr.link} key={index}>
                    <p
                      className="text-sm text-gray-300 hover:text-primary-300"
                      key={index}
                    >
                      <span className="text-primary-500 text-sm pr-2">➞</span>
                      {pr.title}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          )}

        {contributor["activityData"] &&
          contributor["activityData"]["activity"] && (
            <div className="mt-6 overflow-x-hidden px-4 md:p-0">
              <h3 className="font-bold text-gray-100">Contributions</h3>
              <GithubActivity activityData={contributor["activityData"]} />
            </div>
          )}
      </div>
    </div>
  );
}

export async function getStaticProps({ params }) {
  const contributor = getContributorBySlug(params.slug, true);
  const content = await markdownToHtml(contributor.content || "");

  return {
    props: {
      contributor: {
        ...contributor,
        content,
      },
    },
  };
}
export async function getStaticPaths() {
  const paths = [];

  getContributors(true).map((contributor) => {
    paths.push({
      params: {
        slug: contributor.slug,
      },
    });
  });

  return {
    paths: paths,
    fallback: false,
  };
}
