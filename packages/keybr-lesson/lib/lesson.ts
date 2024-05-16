import { KeyboardOptions, type WeightedCodePointSet } from "@keybr/keyboard";
import { type PhoneticModel } from "@keybr/phonetic-model";
import { LCG, type RNGStream } from "@keybr/rand";
import { type KeyStatsMap, type Result, ResultGroups } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type LessonKeys } from "./key.ts";

export abstract class Lesson {
  rng: RNGStream = LCG(Date.now());

  protected constructor(
    readonly settings: Settings,
    readonly model: PhoneticModel,
    readonly codePoints: WeightedCodePointSet,
  ) {}

  filter(results: readonly Result[]): readonly Result[] {
    return ResultGroups.byLayoutFamily(results).get(
      KeyboardOptions.from(this.settings).layout.family,
    );
  }

  abstract analyze(results: readonly Result[]): KeyStatsMap;

  abstract update(keyStatsMap: KeyStatsMap): LessonKeys;

  abstract generate(lessonKeys: LessonKeys): string;
}
