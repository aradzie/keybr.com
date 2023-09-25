import { Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { weightedRandomSample } from "@keybr/rand";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet } from "@keybr/unicode";
import { LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";

export class NumbersLesson extends Lesson {
  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: CodePointSet,
  ) {
    super(settings, model, codePoints);
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(Letter.digits, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap);
  }

  override generate(): string {
    const words = [];
    let wordsLength = 0;
    while (true) {
      const word = this.nextWord();
      words.push(word);
      wordsLength += word.length;
      if (wordsLength >= 50) {
        break;
      }
    }
    return words.join(" ");
  }

  nextWord(): string {
    const [zeroDigit, ...nonZeroDigits] = Letter.digits;
    const allDigits = [zeroDigit, ...nonZeroDigits];
    const length = Math.floor(3 + this.rng() * 4);
    const word = [];
    let last = null;
    for (let i = 0; i < length; i++) {
      while (true) {
        const digit =
          i === 0
            ? weightedRandomSample(nonZeroDigits, ({ f }) => f, this.rng)
            : weightedRandomSample(allDigits, ({ f }) => 1, this.rng);
        if (digit !== last) {
          word.push(digit);
          last = digit;
          break;
        }
      }
    }
    return String.fromCodePoint(...word.map(({ codePoint }) => codePoint));
  }
}
