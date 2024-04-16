import { ResultGroups } from "./group.ts";
import { LocalDate } from "./localdate.ts";
import { type Result } from "./result.ts";
import { newSummaryStats, type SummaryStats } from "./summarystats.ts";

export type AllTimeStats = {
  readonly results: readonly Result[];
  readonly stats: SummaryStats;
};

export type DateStats = {
  readonly date: LocalDate;
  readonly results: readonly Result[];
  readonly stats: SummaryStats;
};

export class ResultSummary implements Iterable<DateStats> {
  readonly #map = new Map<string, DateStats>();
  /** Summary stats for all the results. */
  readonly allTimeStats: AllTimeStats;
  /** Summary stats for the results of today. May not exist in the iterated entries. */
  readonly todayStats: DateStats;

  constructor(results: readonly Result[], today: LocalDate = LocalDate.now()) {
    const groups = ResultGroups.byDate(results);
    for (const { key, results } of groups) {
      this.#map.set(String(key), makeStats(key, results));
    }
    this.allTimeStats = { results, stats: newSummaryStats(results) };
    this.todayStats = this.#map.get(String(today)) ?? makeStats(today, []);
  }

  [Symbol.iterator](): IterableIterator<DateStats> {
    return this.#map.values();
  }

  has(date: LocalDate): boolean {
    return this.#map.has(String(date));
  }

  get(date: LocalDate): DateStats {
    const group = this.#map.get(String(date));
    if (group == null) {
      throw new Error();
    }
    return group;
  }
}

function makeStats(date: LocalDate, results: readonly Result[]): DateStats {
  return { date, results, stats: newSummaryStats(results) };
}
