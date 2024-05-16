import { type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { lessonProps } from "./settings.ts";

export function makeDailyGoal(
  settings: Settings,
  results: readonly Result[],
): DailyGoal {
  const goal = new MutableDailyGoal(settings);
  for (const result of results) {
    goal.append(result);
  }
  return goal.copy();
}

export type DailyGoal = {
  /** Daily goal in minutes. */
  readonly goal: number;
  /** Progress in range [0, 1]. */
  readonly value: number;
};

export class MutableDailyGoal implements DailyGoal {
  readonly #goal: number;
  #time: number;
  #value: number;

  constructor(settings: Settings) {
    this.#goal = settings.get(lessonProps.dailyGoal);
    this.#time = 0;
    this.#value = 0;
  }

  get goal(): number {
    return this.#goal;
  }

  get value(): number {
    return this.#value;
  }

  append(result: Result) {
    this.#time += result.time;
    this.#value = this.#goal > 0 ? this.#time / 1000 / 60 / this.#goal : 0;
  }

  copy(): DailyGoal {
    return { goal: this.#goal, value: this.#value };
  }
}
