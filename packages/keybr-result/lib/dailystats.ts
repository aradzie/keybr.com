import { ResultGroups } from "./group.ts";
import { LocalDate } from "./localdate.ts";
import { type Result } from "./result.ts";
import { makeSummaryStats, type SummaryStats } from "./summarystats.ts";

export type DailyStats = {
  readonly date: LocalDate;
  readonly results: readonly Result[];
  readonly stats: SummaryStats;
};

export class DailyStatsMap implements Iterable<DailyStats> {
  readonly #map = new Map<string, DailyStats>();
  readonly #today: DailyStats;

  constructor(results: readonly Result[], today: LocalDate = LocalDate.now()) {
    const groups = ResultGroups.byDate(results);
    for (const { key, results } of groups) {
      this.#map.set(String(key), makeStats(key, results));
    }
    this.#today = this.#map.get(String(today)) ?? makeStats(today, []);
  }

  [Symbol.iterator](): IterableIterator<DailyStats> {
    return this.#map.values();
  }

  has(date: LocalDate): boolean {
    return this.#map.has(String(date));
  }

  get(date: LocalDate): DailyStats {
    return this.#map.get(String(date)) ?? makeStats(date, []);
  }

  /** Summary stats for the results of today. May not exist in the iterated entries. */
  get today(): DailyStats {
    return this.#today;
  }
}

function makeStats(date: LocalDate, results: readonly Result[]): DailyStats {
  return { date, results, stats: makeSummaryStats(results) };
}
