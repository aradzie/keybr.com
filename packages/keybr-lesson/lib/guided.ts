import { Filter, Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet } from "@keybr/unicode";
import { LessonKey, LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import { mangledWords, phoneticWords, uniqueWords } from "./text/words.ts";

export class GuidedLesson extends Lesson {
  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: CodePointSet,
  ) {
    super(settings, model, codePoints);
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    const letters = Letter.frequencyOrder(this.model.letters);

    const minSize = 6;
    const maxSize =
      minSize +
      Math.round(
        (letters.length - minSize) *
          this.settings.get(lessonProps.guided.alphabetSize),
      );

    const target = new Target(this.settings);

    const lessonKeys = new LessonKeys(
      letters.map((letter) => LessonKey.from(keyStatsMap.get(letter), target)),
    );

    for (const lessonKey of lessonKeys) {
      const includedKeys = lessonKeys.findIncludedKeys();

      if (includedKeys.length < minSize) {
        // Meet the minimal required alphabet size.
        lessonKeys.include(lessonKey.letter);
        continue;
      }

      if (includedKeys.length >= minSize && includedKeys.length < maxSize) {
        // Meet the maximal required alphabet size.
        lessonKeys.force(lessonKey.letter);
        continue;
      }

      if ((lessonKey.bestConfidence ?? 0) >= 1) {
        // Must include all confident keys.
        lessonKeys.include(lessonKey.letter);
        continue;
      }

      if (includedKeys.every((key) => (key.bestConfidence ?? 0) >= 1)) {
        // Must include at least one non-confident key.
        lessonKeys.include(lessonKey.letter);
        continue;
      }
    }

    // Find the least confident of all included keys and boost it.
    const boostedKey = LessonKey.findBoosted(lessonKeys.findIncludedKeys());
    if (boostedKey != null) {
      lessonKeys.boost(boostedKey.letter);
    }

    return lessonKeys;
  }

  override generate(lessonKeys: LessonKeys): string {
    const filter = new Filter(
      lessonKeys.findIncludedKeys(),
      lessonKeys.findBoostedKey(),
    );
    const wordGenerator = phoneticWords(this.model, filter, this.rng);
    const words = mangledWords(
      uniqueWords(wordGenerator),
      Letter.restrict(Letter.punctuators, this.codePoints),
      {
        withCapitals: this.settings.get(lessonProps.capitals) ? 0.3 : 0,
        withPunctuators: this.settings.get(lessonProps.punctuators) ? 0.3 : 0,
      },
      this.rng,
    );
    return generateFragment(this.settings, words);
  }
}
