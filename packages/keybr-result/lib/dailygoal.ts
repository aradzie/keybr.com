import { type Result } from "./result.ts";

export type DailyGoal = {
  /** Progress in range [0, 1]. */
  readonly value: number;
  /** Daily goal in minutes. */
  readonly goal: number;
};

export function computeDailyGoal(
  results: readonly Result[],
  goal: number,
): DailyGoal {
  if (goal > 0) {
    let time = 0;
    for (const result of results) {
      time += result.time;
    }
    return { value: time / 1000 / 60 / goal, goal };
  } else {
    return { value: 0, goal: 0 };
  }
}
