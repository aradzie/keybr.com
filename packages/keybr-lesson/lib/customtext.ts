import { type Language, type WeightedCodePointSet } from "@keybr/keyboard";
import { type Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet, toCodePoints } from "@keybr/unicode";
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
    this.wordList = getWordList(
      settings,
      model.language,
      model.letters,
      codePoints,
    );
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
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
}

function getWordList(
  settings: Settings,
  language: Language,
  letters: readonly Letter[],
  codePoints: CodePointSet,
): string[] {
  const content = settings.get(lessonProps.customText.content);
  const lettersOnly = settings.get(lessonProps.customText.lettersOnly);
  const lowercase = settings.get(lessonProps.customText.lowercase);
  if (lettersOnly) {
    const s = String.fromCodePoint(
      ...letters.map(({ codePoint }) => codePoint),
    );
    codePoints = new Set(
      toCodePoints(language.lowerCase(s) + language.upperCase(s)),
    );
  }
  let text = sanitizeText(content, codePoints);
  if (lowercase) {
    text = language.lowerCase(text);
  }
  return text.trim().split(/[\s\n]+/);
}
