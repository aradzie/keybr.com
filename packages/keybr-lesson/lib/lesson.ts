import {
  type Keyboard,
  KeyboardOptions,
  type WeightedCodePointSet,
} from "@keybr/keyboard";
import { type Letter, PhoneticModel } from "@keybr/phonetic-model";
import { LCG, type RNGStream } from "@keybr/rand";
import { type KeyStatsMap, type Result, ResultGroups } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type LessonKeys } from "./key.ts";

export abstract class Lesson {
  readonly settings: Settings;
  readonly keyboard: Keyboard;
  readonly codePoints: WeightedCodePointSet;
  readonly model: PhoneticModel;
  rng: RNGStream = LCG(Date.now());

  protected constructor(
    settings: Settings,
    keyboard: Keyboard,
    model: PhoneticModel,
  ) {
    this.settings = settings;
    this.keyboard = keyboard;
    this.codePoints = keyboard.getCodePoints();
    this.model = PhoneticModel.restrict(model, this.codePoints);
  }

  filter(results: readonly Result[]): readonly Result[] {
    return ResultGroups.byLayoutFamily(results).get(
      KeyboardOptions.from(this.settings).layout.family,
    );
  }

  abstract get letters(): readonly Letter[];

  abstract update(keyStatsMap: KeyStatsMap): LessonKeys;

  abstract generate(lessonKeys: LessonKeys): string;
}
