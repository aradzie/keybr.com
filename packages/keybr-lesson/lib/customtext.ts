import { Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet, toCodePoints } from "@keybr/unicode";
import { LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { generateFragment } from "./text/fragment.ts";
import { sanitizeText } from "./text/sanitizetext.ts";
import { splitText } from "./text/splittext.ts";
import { type WordGenerator, wordSequence } from "./text/words.ts";

export class CustomTextLesson extends Lesson {
  readonly #words: WordGenerator;

  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: CodePointSet,
  ) {
    super(settings, model, codePoints);
    this.#words = wordSequence(
      getWordList(settings, model.letters, codePoints),
    );
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap);
  }

  override generate(): string {
    return generateFragment(this.settings, this.#words);
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
