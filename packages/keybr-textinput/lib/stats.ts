import { Histogram } from "./histogram.ts";
import { type Step } from "./textinput.ts";

export type Stats = {
  readonly time: number;
  readonly speed: number;
  readonly length: number;
  readonly errors: number;
  readonly accuracy: number;
  readonly histogram: Histogram;
};

export function makeStats(steps: readonly Step[]): Stats {
  if (steps.length >= 2) {
    const { timeStamp: startedAt } = steps.at(0)!;
    const { timeStamp: endedAt } = steps.at(-1)!;
    const { length } = steps;
    const time = Math.round(endedAt - startedAt);
    const speed = computeSpeed(length, time);
    const errors = countErrors(steps);
    const accuracy = (length - errors) / length;
    return {
      time,
      speed,
      length,
      errors,
      accuracy,
      histogram: Histogram.from(steps.slice(1)), // The trigger step is ignored.
    };
  } else {
    return {
      time: 0,
      speed: 0,
      length: 0,
      errors: 0,
      accuracy: 0,
      histogram: Histogram.empty,
    };
  }
}

export function countErrors(steps: readonly Step[]): number {
  let errors = 0;
  for (const item of steps) {
    if (item.typo) {
      errors += 1;
    }
  }
  return errors;
}

export function computeSpeed(length: number, time: number): number {
  return time > 0 ? (length / (time / 1000)) * 60 : 0;
}
