import { type WeightedCodePointSet } from "@keybr/keyboard";
import { type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, makeKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import { sanitizeText } from "./text/sanitizetext.ts";
import {
  randomWords,
  uniqueWords,
  type WordGenerator,
  wordSequence,
} from "./text/words.ts";

export class CustomTextLesson extends Lesson {
  readonly wordList: readonly string[];
  wordIndex = 0;

  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: WeightedCodePointSet,
  ) {
    super(settings, model, codePoints);
    this.wordList = this.#getWordList();
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return makeKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap, new Target(this.settings));
  }

  override generate(): string {
    return generateFragment(this.settings, this.#makeWordGenerator(), {
      doubleWords: false,
    });
  }

  #makeWordGenerator(): WordGenerator {
    const randomize = this.settings.get(lessonProps.customText.randomize);
    if (randomize && this.wordList.length > 0) {
      return uniqueWords(randomWords(this.wordList, this.rng));
    } else {
      return wordSequence(this.wordList, this);
    }
  }

  #getWordList(): string[] {
    const content = this.settings.get(lessonProps.customText.content);
    const lettersOnly = this.settings.get(lessonProps.customText.lettersOnly);
    const lowercase = this.settings.get(lessonProps.customText.lowercase);
    const codePoints = new Set(this.codePoints);
    if (lettersOnly) {
      for (const codePoint of codePoints) {
        if (!this.model.language.includes(codePoint)) {
          codePoints.delete(codePoint);
        }
      }
    }
    let text = sanitizeText(content, codePoints);
    if (lowercase) {
      text = this.model.language.lowerCase(text);
    }
    return text.split(/\s+/);
  }
}
