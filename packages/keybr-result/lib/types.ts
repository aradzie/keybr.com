import { type Letter } from "@keybr/phonetic-model";
import { type Result } from "./result.ts";

export type SummaryStats = {
  readonly totalTime: number;
  readonly speed: Metric;
  readonly accuracy: Metric;
  readonly score: Metric;
};

export type Metric = {
  /** Last value. */
  readonly last: number;
  /** Change in last value compared to average. */
  readonly delta: number;
  /** Maximal value seen so far. */
  readonly max: number;
  /** Minimal value seen so far. */
  readonly min: number;
  /** Average of all values seen so far. */
  readonly avg: number;
};

export type KeyStatsMap = {
  readonly letters: readonly Letter[];
  readonly results: readonly Result[];
  get(letter: Letter): KeyStats;
} & Iterable<KeyStats>;

export type KeyStats = {
  readonly letter: Letter;
  readonly samples: readonly KeySample[];
  readonly timeToType: number;
  readonly bestTimeToType: number;
};

export type KeySample = {
  readonly index: number;
  readonly timeStamp: number;
  readonly hitCount: number;
  readonly missCount: number;
  readonly timeToType: number;
  readonly filteredTimeToType: number;
};
