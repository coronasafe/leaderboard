import { LeaderboardSortKey } from "@/app/leaderboard/Leaderboard";
import { parseDateRangeSearchParam } from "@/lib/utils";
import { getLeaderboardData } from "./functions";

type OrderingKey = LeaderboardSortKey | `-${LeaderboardSortKey}`;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const dateRange = parseDateRangeSearchParam(searchParams.get("between"));
  const ordering = searchParams.get("sort") ?? "-points";

  const data = await getLeaderboardData(dateRange, ordering as OrderingKey);

  return Response.json(data);
}
