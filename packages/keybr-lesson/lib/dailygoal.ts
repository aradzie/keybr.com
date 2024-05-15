import { type Result, Today } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { lessonProps } from "./settings.ts";

export type DailyGoal = {
  /** Daily goal in minutes. */
  readonly goal: number;
  /** Progress in range [0, 1]. */
  readonly value: number;
};

export class MutableDailyGoal implements DailyGoal {
  readonly #goal: number;
  readonly #today: Today;
  #time: number;
  #value: number;

  constructor(settings: Settings, today: Today = new Today()) {
    this.#goal = settings.get(lessonProps.dailyGoal);
    this.#today = today;
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
    if (this.#today.includes(result.timeStamp)) {
      this.#time += result.time;
      this.#value = this.#goal > 0 ? this.#time / 1000 / 60 / this.#goal : 0;
    }
  }

  copy(): DailyGoal {
    return { goal: this.#goal, value: this.#value };
  }
}
