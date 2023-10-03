import {
  type Content,
  flattenContent,
  splitParagraph,
} from "@keybr/content-books";
import { type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet } from "@keybr/unicode";
import { LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import { wordSequence } from "./text/words.ts";

export class BookContentLesson extends Lesson {
  readonly wordList: readonly string[];
  wordIndex = 0;

  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: CodePointSet,
    content: Content,
  ) {
    super(settings, model, codePoints);
    this.wordList = flattenContent(content)
      .map((para) => splitParagraph(para))
      .flat();
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap, new Target(this.settings));
  }

  override generate(): string {
    return generateFragment(this.settings, wordSequence(this.wordList, this));
  }
}
