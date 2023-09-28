import { type HasCodePoint } from "@keybr/keyboard";
import { type Lesson, type LessonKeys } from "@keybr/lesson";
import { Histogram, KeySet } from "@keybr/math";
import { type KeyStatsMap, Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import {
  type Feedback,
  type LineData,
  newStats,
  singleLine,
  TextInput,
} from "@keybr/textinput";
import { type Announcement } from "./Announcer.tsx";

export type LastLesson = {
  readonly result: Result;
  readonly hits: Histogram<HasCodePoint>;
  readonly misses: Histogram<HasCodePoint>;
};

export class PracticeState {
  readonly keyStatsMap: KeyStatsMap;
  readonly lessonKeys: LessonKeys;
  readonly announcements: Announcement[] = [];

  lastLesson: LastLesson | null = null;

  textInput!: TextInput; // Mutable.
  lines!: readonly LineData[]; // Mutable.

  constructor(
    readonly settings: Settings,
    readonly lesson: Lesson,
    readonly results: readonly Result[],
    readonly appendResult: (result: Result) => void,
  ) {
    this.keyStatsMap = this.lesson.analyze(this.results);
    this.lessonKeys = this.lesson.update(this.keyStatsMap);
    this.#reset(this.lesson.generate(this.lessonKeys));
    this.#computeAnnouncements();
  }

  readonly handleReset = (): void => {
    this.#reset(this.textInput.text);
  };

  readonly handleSkip = (): void => {
    this.#reset(this.lesson.generate(this.lessonKeys));
  };

  readonly handleInput = (codePoint: number, timeStamp: number): Feedback => {
    const feedback = this.textInput.step(codePoint, timeStamp);
    this.lines = singleLine(this.textInput.getChars());
    if (this.textInput.completed) {
      this.appendResult(
        Result.fromStats(
          this.settings.layout,
          this.settings.lessonType.textType,
          Date.now(),
          newStats(this.textInput.getSteps()),
        ),
      );
    }
    return feedback;
  };

  #reset(fragment: string): void {
    this.textInput = new TextInput(fragment, this.settings);
    this.lines = singleLine(this.textInput.getChars());
  }

  #computeAnnouncements(): void {
    const { results, keyStatsMap, lessonKeys } = this;
    if (results.length > 0) {
      const boostedKey = lessonKeys.findBoostedKey();
      if (boostedKey != null) {
        const keyStats = keyStatsMap.get(boostedKey.letter);
        if (keyStats.samples.length === 0) {
          this.announcements.push({ lessonKey: boostedKey });
        }
      }
    }
  }
}

export function makeLastLesson(result: Result): LastLesson {
  const keySet = new KeySet<HasCodePoint>([]);
  const hits = new Histogram(keySet);
  const misses = new Histogram(keySet);
  for (const { codePoint, hitCount, missCount } of result.histogram) {
    hits.set({ codePoint }, hitCount);
    misses.set({ codePoint }, missCount);
  }
  return { result, hits, misses };
}
