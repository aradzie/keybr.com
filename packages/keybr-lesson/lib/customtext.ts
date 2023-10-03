import { Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet, toCodePoints } from "@keybr/unicode";
import { LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import { sanitizeText } from "./text/sanitizetext.ts";
import { splitText } from "./text/splittext.ts";
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
    codePoints: CodePointSet,
  ) {
    super(settings, model, codePoints);
    this.wordList = getWordList(settings, model.letters, codePoints);
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap, new Target(this.settings));
  }

  override generate(): string {
    return generateFragment(this.settings, this.makeWordGenerator());
  }

  private makeWordGenerator(): WordGenerator {
    if (this.settings.textRandomize && this.wordList.length > 0) {
      return uniqueWords(randomWords(this.wordList, this.rng));
    } else {
      return wordSequence(this.wordList, this);
    }
  }
}

function getWordList(
  settings: Settings,
  letters: readonly Letter[],
  codePoints: CodePointSet,
): string[] {
  if (settings.textSimplify) {
    const s = String.fromCodePoint(...letters.map(Letter.codePointOf));
    codePoints = new Set(toCodePoints(s.toLowerCase() + s.toUpperCase()));
  }
  let text = sanitizeText(settings.textContent, codePoints);
  if (settings.textLowercase) {
    text = text.toLowerCase();
  }
  return splitText(text);
}
