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

export class BookContentLesson extends Lesson {
  private readonly words: readonly string[];

  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: CodePointSet,
    content: Content,
  ) {
    super(settings, model, codePoints);
    this.words = flattenContent(content)
      .map((para) => splitParagraph(para))
      .flat();
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap);
  }

  override generate(): string {
    return this.words.slice(0, 30).join(" ");
  }
}
