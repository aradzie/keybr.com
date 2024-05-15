import { type Result } from "@keybr/result";
import {
  type LessonEventListener,
  type LessonEventSource,
} from "./event-types.ts";

export class TopSpeedEvents implements LessonEventSource {
  #resultCount = 0;
  #topSpeed = 0;

  append(result: Result, listener: LessonEventListener): void {
    this.#resultCount += 1;
    const { speed } = result;
    if (speed > this.#topSpeed) {
      if (this.#resultCount >= 3) {
        listener({
          type: "top-speed",
          speed,
          previous: this.#topSpeed,
        });
      }
      this.#topSpeed = speed;
    }
  }
}
