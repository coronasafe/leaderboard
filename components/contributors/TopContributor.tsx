import { LeaderboardAPIResponse, TopContributorCategoryKey } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { TOP_CONTRIBUTOR_CATEGORIES } from "@/lib/const";
import TopContributorImage from "./TopContributorImage";

export default function InfoCard({
  data,
  category,
}: {
  data: LeaderboardAPIResponse;
  category: TopContributorCategoryKey;
}) {
  let resultSet = data.filter((c) => c.highlights[category]);

  const points = Math.max(...resultSet.map((c) => c.highlights[category]));

  resultSet = resultSet
    .filter((c) => c.highlights[category] === points)
    .sort((a, b) => b.highlights.points - a.highlights.points)
    .slice(0, 3);

  if (!resultSet.length) return null;

  return (
    <div
      className="flex flex-col items-center rounded-lg bg-secondary-100 px-2 py-6 text-center dark:bg-secondary-800 xl:px-8 xl:text-left"
      role="listitem"
    >
      <span className="text-center text-sm text-foreground">
        Most # of{" "}
        <span className="font-bold">
          {TOP_CONTRIBUTOR_CATEGORIES[category]}
        </span>
      </span>
      <ul className="mt-4 space-y-3">
        {resultSet.map((contributor, index) => (
          <li
            className={`relative hover:scale-105 ${
              ["opacity-100", "opacity-80", "opacity-60"][0]
            } hover:opacity-100`}
            key={contributor.user.social.github}
          >
            <Link
              href={`/contributors/${contributor.user.social.github}`}
              className="flex w-full items-center gap-4"
            >
              <TopContributorImage
                src={`https://avatars.githubusercontent.com/${contributor.user.social.github}`}
                alt={contributor.user.social.github}
                title={contributor.user.name}
              />
              <span className="font-bold text-primary-400">
                {contributor.user.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
