import { type Result } from "@keybr/result";
import {
  type LessonEventListener,
  type LessonEventSource,
} from "./event-types.ts";

export class TopScoreEvents implements LessonEventSource {
  #resultCount = 0;
  #topScore = 0;

  append(result: Result, listener: LessonEventListener): void {
    this.#resultCount += 1;
    const { score } = result;
    if (score > this.#topScore) {
      if (this.#resultCount >= 3) {
        listener({
          type: "top-score",
          score,
          previous: this.#topScore,
        });
      }
      this.#topScore = score;
    }
  }
}
