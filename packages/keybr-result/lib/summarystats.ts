import { type Result } from "./result.ts";

export type SummaryStats = {
  /** Number of results. */
  readonly count: number;
  /** Total time of all results. */
  readonly time: number;
  /** Speed stats. */
  readonly speed: Metric;
  /** Accuracy stats. */
  readonly accuracy: Metric;
  /** Score stats. */
  readonly score: Metric;
};

export type Metric = {
  /** Last value. */
  readonly last: number;
  /** Change in last value compared to average. */
  readonly delta: number;
  /** Minimal value seen so far. */
  readonly min: number;
  /** Maximal value seen so far. */
  readonly max: number;
  /** Average of all values seen so far. */
  readonly avg: number;
};

export function newSummaryStats(results: readonly Result[]): SummaryStats {
  let count = 0;
  let time = 0;
  const speed = new Counter();
  const accuracy = new Counter();
  const score = new Counter();

  for (const result of results) {
    count += 1;
    time += result.time;
    speed.append(result.speed);
    accuracy.append(result.accuracy);
    score.append(result.score);
  }

  return {
    count,
    time,
    speed: speed.toMetric(),
    accuracy: accuracy.toMetric(),
    score: score.toMetric(),
  };
}

export class Counter {
  last: number = 0;
  delta: number = 0;
  count: number = 0;
  sum: number = 0;
  min: number = 0;
  max: number = 0;
  avg: number = 0;

  append(value: number): void {
    this.count += 1;
    if (this.count === 1) {
      this.last = value;
      this.delta = value;
      this.sum = value;
      this.min = value;
      this.max = value;
      this.avg = value;
    } else {
      this.last = value;
      this.delta = value - this.avg;
      this.sum += value;
      this.min = Math.min(this.min, value);
      this.max = Math.max(this.max, value);
      this.avg = this.sum / this.count;
    }
  }

  toMetric(): Metric {
    return {
      last: this.last,
      delta: this.delta,
      min: this.min,
      max: this.max,
      avg: this.avg,
    };
  }
}
