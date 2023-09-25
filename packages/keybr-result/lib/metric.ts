import { type Metric } from "./types.ts";

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
      max: this.max,
      min: this.min,
      avg: this.avg,
    };
  }
}
