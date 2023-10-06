import { type WordList } from "@keybr/content-words";
import { Letter, type PhoneticModel } from "@keybr/phonetic-model";
import { type KeyStatsMap, newKeyStatsMap, type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type CodePointSet, toCodePoints } from "@keybr/unicode";
import { LessonKeys } from "./key.ts";
import { Lesson } from "./lesson.ts";
import { lessonProps } from "./settings.ts";
import { Target } from "./target.ts";
import { generateFragment } from "./text/fragment.ts";
import { mangledWords, randomWords, uniqueWords } from "./text/words.ts";

export class WordListLesson extends Lesson {
  readonly wordList: WordList;

  constructor(
    settings: Settings,
    model: PhoneticModel,
    codePoints: CodePointSet,
    wordList: WordList,
  ) {
    super(settings, model, codePoints);
    this.wordList = wordList
      .filter((word) =>
        [...toCodePoints(word)].every((codePoint) => codePoints.has(codePoint)),
      )
      .slice(0, settings.get(lessonProps.wordList.wordListSize));
  }

  override analyze(results: readonly Result[]): KeyStatsMap {
    return newKeyStatsMap(this.model.letters, results);
  }

  override update(keyStatsMap: KeyStatsMap): LessonKeys {
    return LessonKeys.includeAll(keyStatsMap, new Target(this.settings));
  }

  override generate(): string {
    const wordGenerator = randomWords(this.wordList, this.rng);
    const words = mangledWords(
      uniqueWords(wordGenerator),
      Letter.restrict(Letter.punctuators, this.codePoints),
      {
        withCapitals: this.settings.get(lessonProps.capitals),
        withPunctuators: this.settings.get(lessonProps.punctuators),
      },
      this.rng,
    );
    return generateFragment(this.settings, words);
  }
}
