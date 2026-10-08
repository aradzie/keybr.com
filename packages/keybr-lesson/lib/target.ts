import { type Letter } from "@keybr/phonetic-model";
import { speedToTime } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { lessonProps } from "./settings.ts";

export class Target {
  readonly #settings: Settings;
  readonly targetSpeed: number;

  constructor(settings: Settings, letter: Letter | null = null) {
    this.#settings = settings;
    this.targetSpeed =
      (letter != null
        ? settings
            .get(lessonProps.letterTargetSpeed)
            .get(Target.letterKey(letter))
        : null) ?? settings.get(lessonProps.targetSpeed);
  }

  /**
   * Returns the target of the given letter, which is either
   * the letter's own target speed or the default target speed.
   */
  forLetter(letter: Letter): Target {
    return new Target(this.#settings, letter);
  }

  confidence(timeToType: number): number;
  confidence(timeToType: null): null;
  confidence(timeToType: number | null): number | null;
  confidence(timeToType: number | null): number | null {
    if (timeToType == null) {
      return null;
    }
    if (!Number.isFinite(timeToType) || timeToType === 0) {
      throw new Error();
    }
    return speedToTime(this.targetSpeed) / timeToType;
  }
}

export namespace Target {
  /** Returns the key of a letter in the per-letter target speed setting. */
  export function letterKey({ codePoint }: Letter): string {
    return String.fromCodePoint(codePoint);
  }
}
