import {
  type Content,
  flattenContent,
  splitParagraph,
} from "@keybr/content-books";
import { type WeightedCodePointSet } from "@keybr/keyboard";
import { type Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap } from "@keybr/result";
import { type Settings } from "@keybr/settings";
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
    codePoints: WeightedCodePointSet,
    content: Content,
  ) {
    super(settings, model, codePoints);
    this.wordList = flattenContent(content)
      .map((para) => splitParagraph(para))
      .flat();
  }

  override get letters(): readonly Letter[] {
    return this.model.letters;
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap, new Target(this.settings));
  }

  override generate(): string {
    return generateFragment(this.settings, wordSequence(this.wordList, this), {
      doubleWords: false,
    });
  }
}
