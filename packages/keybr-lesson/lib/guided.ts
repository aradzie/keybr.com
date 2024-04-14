import { type WordList } from "@keybr/content-words";
import { type WeightedCodePointSet } from "@keybr/keyboard";
import { Filter, Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet } from "@keybr/unicode";
import { Dictionary, filterWordList } from "./dictionary.ts";
import { LessonKey, LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import {
  mangledWords,
  phoneticWords,
  randomWords,
  uniqueWords,
  type WordGenerator,
} from "./text/words.ts";

export class GuidedLesson extends Lesson {
  readonly dictionary: Dictionary;
  readonly programmingMode: boolean;
  readonly programmingCodePoint: CodePointSet;

  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: WeightedCodePointSet,
    wordList: WordList,
  ) {
    super(settings, model, codePoints);
    this.dictionary = new Dictionary(
      filterWordList(wordList, codePoints).filter((word) => word.length > 2),
    );
    this.programmingMode = settings.get(lessonProps.programming);
    this.programmingCodePoint = new Set(
      Letter.programming.map(Letter.codePointOf),
    );
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    if (this.programmingMode) {
      return newKeyStatsMap(
        this.model.letters.concat(Letter.programming),
        results,
      );
    }
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    const alphabetSize = this.settings.get(lessonProps.guided.alphabetSize);
    const recoverKeys = this.settings.get(lessonProps.guided.recoverKeys);

    let letters = this.getLetters();
    if (this.programmingMode) {
      letters = letters.concat(Letter.programming);
    }

    const minSize = 6;
    const maxSize =
      minSize + Math.round((letters.length - minSize) * alphabetSize);

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

      if (recoverKeys) {
        if (includedKeys.every((key) => (key.confidence ?? 0) >= 1)) {
          // Include a new key only when all the previous keys
          // are now above the target speed.
          lessonKeys.include(lessonKey.letter);
          continue;
        }
      } else {
        if (includedKeys.every((key) => (key.bestConfidence ?? 0) >= 1)) {
          // Include a new key only when all the previous keys
          // were once above the target speed.
          lessonKeys.include(lessonKey.letter);
          continue;
        }
      }
    }

    // Find the least confident of all included keys and focus on it.
    const confidenceOf = (key: LessonKey): number => {
      return recoverKeys ? key.confidence ?? 0 : key.bestConfidence ?? 0;
    };
    const weakestKeys = lessonKeys
      .findIncludedKeys()
      .filter((key) => confidenceOf(key) < 1)
      .sort((a, b) => confidenceOf(a) - confidenceOf(b));
    if (weakestKeys.length > 0) {
      lessonKeys.focus(weakestKeys[0].letter);
    }

    return lessonKeys;
  }

  override generate(lessonKeys: LessonKeys): string {
    const includedKeys = lessonKeys.findIncludedKeys();

    const mainLessonKeys = includedKeys.filter(
      ({ letter }) => !this.programmingCodePoint.has(letter.codePoint),
    );

    const lessonKey = lessonKeys.findFocusedKey();

    const wordGenerator = this.makeWordGenerator(
      new Filter(
        mainLessonKeys,
        this.programmingCodePoint.has(lessonKey?.letter.codePoint ?? 0)
          ? null
          : lessonKey,
      ),
    );
    const words = mangledWords(
      uniqueWords(wordGenerator),
      this.model.language,
      this.getSpecialLetters(includedKeys),
      {
        withCapitals: this.settings.get(lessonProps.capitals),
        withPunctuators: this.programmingMode
          ? 1
          : this.settings.get(lessonProps.punctuators),
      },
      this.rng,
    );
    return generateFragment(this.settings, words, {
      doubleWords: this.settings.get(lessonProps.doubleWords),
    });
  }

  private getLetters(): Letter[] {
    const { letters } = this.model;
    const { codePoints } = this;
    if (this.settings.get(lessonProps.guided.keyboardOrder)) {
      return Letter.weightedFrequencyOrder(letters, ({ codePoint }) =>
        codePoints.weight(codePoint),
      );
    } else {
      return Letter.frequencyOrder(letters);
    }
  }

  private getSpecialLetters(includedKeys: LessonKey[]): Letter[] {
    if (this.programmingMode) {
      const includedProgrammigCodePoints = new Set(
        includedKeys
          .filter(({ letter }) =>
            this.programmingCodePoint.has(letter.codePoint),
          )
          .map(({ letter }) => Letter.codePointOf(letter)),
      );
      return Letter.restrict(Letter.programming, includedProgrammigCodePoints);
    }
    return Letter.restrict(Letter.punctuators, this.codePoints);
  }

  private makeWordGenerator(filter: Filter): WordGenerator {
    const pseudoWords = phoneticWords(this.model, filter, this.rng);
    if (this.settings.get(lessonProps.guided.naturalWords)) {
      const words = [...this.dictionary.find(filter)];
      while (words.length < 15) {
        words.push(pseudoWords() ?? "?");
      }
      return randomWords(words, this.rng);
    }
    return pseudoWords;
  }
}
