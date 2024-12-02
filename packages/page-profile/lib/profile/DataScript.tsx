import type { DailyStatsMap, SummaryStats } from "@keybr/result";

export function DataScript({
  stats,
  dailyStatsMap,
}: {
  stats: SummaryStats;
  dailyStatsMap: DailyStatsMap;
}) {
  return (
    <script
      id="profile-data"
      type="application/json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          allTime: stats,
          today: dailyStatsMap.today.stats,
          byDate: Object.fromEntries(
            [...dailyStatsMap].map(({ date, stats }) => [date, stats]),
          ),
        }),
      }}
    ></script>
  );
}
