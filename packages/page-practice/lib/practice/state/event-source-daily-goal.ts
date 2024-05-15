import { type MutableDailyGoal } from "@keybr/lesson";
import { type Result } from "@keybr/result";
import {
  type LessonEventListener,
  type LessonEventSource,
} from "./event-types.ts";

export class DailyGoalEvents implements LessonEventSource {
  readonly #dailyGoal: MutableDailyGoal;
  #lastValue: number;

  constructor(dailyGoal: MutableDailyGoal) {
    this.#dailyGoal = dailyGoal;
    this.#lastValue = 0;
  }

  append(result: Result, listener: LessonEventListener): void {
    if (this.#lastValue < 1 && this.#dailyGoal.value >= 1) {
      listener({
        type: "daily-goal",
      });
    }
    this.#lastValue = this.#dailyGoal.value;
  }
}
