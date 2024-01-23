import { getContributors } from "@/lib/api";
import { Contributor } from "@/lib/types";
import Leaderboard from "./Leaderboard";
import { LeaderboardSortKey } from "./Filters";
import { parseDateRangeSearchParam } from "@/lib/utils";

const getResultSet = (searchParams: PageProps["searchParams"]) => {
  const [start, end] = parseDateRangeSearchParam(searchParams.between);
  const sortBy = searchParams.sortBy ?? "points";

  let data = getContributors().filter((a) => a.highlights.points);

  const filterByRole = (contributor: Contributor) => {
    const roles = searchParams.roles?.split(",") ?? [];
    if (
      roles.includes("contributor") &&
      !contributor.intern &&
      !contributor.operations &&
      !contributor.core
    )
      return true;
    for (const role of roles) {
      if (contributor[role as "intern" | "operations" | "core"]) return true;
    }
    return false;
  };

  if (searchParams.roles) {
    data = data.filter(filterByRole);
  }

  const result = data
    .map((contributor) => ({
      ...contributor,
      summary: contributor.summarize(start, end),
      // Because functions are not serializable and cannot be passed as
      // prop to client components from a server component
      summarize: undefined,
    }))
    .sort((a, b) => {
      if (sortBy === "pr_stale") {
        return b.activityData.pr_stale - a.activityData.pr_stale;
      }
      return b.summary[sortBy] - a.summary[sortBy];
    });

  if (searchParams.ordering === "asc") {
    result.reverse();
  }

  return result;
};

export type LeaderboardResultSet = ReturnType<typeof getResultSet>;

type PageProps = {
  searchParams: {
    between?: string; // <start-date>...<end-date>
    sortBy?: LeaderboardSortKey;
    ordering?: "desc" | "asc";
    roles?: string; // typeof subsetOf("core", "intern", "operations", "contributor").join(',')
  };
};

export default function LeaderboardPage({ searchParams }: PageProps) {
  const resultSet = getResultSet(searchParams);
  return <Leaderboard resultSet={resultSet} />;
}
