import { Histogram } from "./histogram.ts";
import { type Step } from "./types.ts";

export type Stats = {
  readonly time: number;
  readonly speed: number;
  readonly length: number;
  readonly errors: number;
  readonly accuracy: number;
  readonly histogram: Histogram;
};

export function newStats(
  steps: readonly Step[],
  {
    startedAt = null,
    endedAt = null,
  }: {
    readonly startedAt?: number | null;
    readonly endedAt?: number | null;
  } = {},
): Stats {
  if (steps.length < 2) {
    return {
      time: 0,
      speed: 0,
      length: 0,
      errors: 0,
      accuracy: 0,
      histogram: Histogram.empty,
    };
  }

  if (startedAt != null && endedAt != null) {
    return compute(steps, startedAt, endedAt);
  } else if (startedAt != null) {
    return compute(steps, startedAt, steps[steps.length - 1].timeStamp);
  } else if (endedAt != null) {
    const [head, ...tail] = steps;
    return compute(tail, head.timeStamp, endedAt);
  } else {
    const [head, ...tail] = steps;
    return compute(tail, head.timeStamp, tail[tail.length - 1].timeStamp);
  }
}

function compute(
  steps: readonly Step[],
  startedAt: number,
  endedAt: number,
): Stats {
  const { length } = steps;
  const time = endedAt - startedAt;
  const speed = computeSpeed(length, time);
  const errors = countErrors(steps);
  const accuracy = (length - errors) / length;
  return {
    time,
    speed,
    length,
    errors,
    accuracy,
    histogram: Histogram.from(steps, { startedAt }),
  };
}

function countErrors(steps: readonly Step[]): number {
  let errors = 0;
  for (const step of steps) {
    if (step.typo) {
      errors += 1;
    }
  }
  return errors;
}

export function computeSpeed(length: number, time: number): number {
  if (time === 0) {
    return 0;
  } else {
    return (length / (time / 1000)) * 60;
  }
}
