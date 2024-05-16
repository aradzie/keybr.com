import { type Result } from "./result.ts";

export function makeSummaryStats(results: readonly Result[]): SummaryStats {
  const stats = new MutableSummaryStats();
  for (const result of results) {
    stats.append(result);
  }
  return stats.copy();
}

export type SummaryStats = {
  /** The number of results. */
  readonly count: number;
  /** The total time of all results. */
  readonly time: number;
  /** The speed stats. */
  readonly speed: Metric;
  /** The accuracy stats. */
  readonly accuracy: Metric;
  /** The score stats. */
  readonly score: Metric;
};

export type Metric = {
  /** The last value. */
  readonly last: number;
  /** The change in last value compared to average. */
  readonly delta: number;
  /** The minimal value seen so far. */
  readonly min: number;
  /** The maximal value seen so far. */
  readonly max: number;
  /** The average of all values seen so far. */
  readonly avg: number;
};

export class MutableSummaryStats implements SummaryStats {
  #count = 0;
  #time = 0;
  readonly #speed = new MutableMetric();
  readonly #accuracy = new MutableMetric();
  readonly #score = new MutableMetric();

  get count(): number {
    return this.#count;
  }

  get time(): number {
    return this.#time;
  }

  get speed(): MutableMetric {
    return this.#speed;
  }

  get accuracy(): MutableMetric {
    return this.#accuracy;
  }

  get score(): MutableMetric {
    return this.#score;
  }

  append(result: Result) {
    this.#count += 1;
    this.#time += result.time;
    this.#speed.append(result.speed);
    this.#accuracy.append(result.accuracy);
    this.#score.append(result.score);
  }

  copy(): SummaryStats {
    return {
      count: this.#count,
      time: this.#time,
      speed: this.#speed.copy(),
      accuracy: this.#accuracy.copy(),
      score: this.#score.copy(),
    };
  }
}

export class MutableMetric implements Metric {
  #last: number = 0;
  #delta: number = 0;
  #count: number = 0;
  #sum: number = 0;
  #min: number = 0;
  #max: number = 0;
  #avg: number = 0;

  get last(): number {
    return this.#last;
  }

  get delta(): number {
    return this.#delta;
  }

  get min(): number {
    return this.#min;
  }

  get max(): number {
    return this.#max;
  }

  get avg(): number {
    return this.#avg;
  }

  append(value: number): void {
    this.#count += 1;
    if (this.#count === 1) {
      this.#last = value;
      this.#delta = value;
      this.#sum = value;
      this.#min = value;
      this.#max = value;
      this.#avg = value;
    } else {
      this.#last = value;
      this.#delta = value - this.#avg;
      this.#sum += value;
      this.#min = Math.min(this.#min, value);
      this.#max = Math.max(this.#max, value);
      this.#avg = this.#sum / this.#count;
    }
  }

  copy(): Metric {
    return {
      last: this.#last,
      delta: this.#delta,
      min: this.#min,
      max: this.#max,
      avg: this.#avg,
    };
  }
}
