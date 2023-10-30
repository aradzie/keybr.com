import { type HasCodePoint, keyboardProps } from "@keybr/keyboard";
import { type Lesson, type LessonKeys, lessonProps } from "@keybr/lesson";
import { Histogram, KeySet } from "@keybr/math";
import { type KeyStatsMap, Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import {
  type Feedback,
  type LineList,
  newStats,
  type TextDisplaySettings,
  TextInput,
  type TextInputSettings,
  toTextDisplaySettings,
  toTextInputSettings,
} from "@keybr/textinput";
import { type Announcement } from "./Announcer.tsx";

export type LastLesson = {
  readonly result: Result;
  readonly hits: Histogram<HasCodePoint>;
  readonly misses: Histogram<HasCodePoint>;
};

export class PracticeState {
  readonly showTour: boolean;
  readonly textInputSettings: TextInputSettings;
  readonly textDisplaySettings: TextDisplaySettings;
  readonly keyStatsMap: KeyStatsMap;
  readonly lessonKeys: LessonKeys;
  readonly announcements: Announcement[] = [];

  lastLesson: LastLesson | null = null;

  textInput!: TextInput; // Mutable.
  lines!: LineList; // Mutable.

  constructor(
    readonly settings: Settings,
    readonly lesson: Lesson,
    readonly results: readonly Result[],
    readonly appendResult: (result: Result) => void,
  ) {
    this.showTour = settings.isNew;
    this.textInputSettings = toTextInputSettings(settings);
    this.textDisplaySettings = toTextDisplaySettings(settings);
    this.keyStatsMap = this.lesson.analyze(this.results);
    this.lessonKeys = this.lesson.update(this.keyStatsMap);
    this._reset(this.lesson.generate(this.lessonKeys));
    this._computeAnnouncements();
  }

  handleResetLesson(): void {
    this._reset(this.textInput.text);
  }

  handleSkipLesson(): void {
    this._reset(this.lesson.generate(this.lessonKeys));
  }

  handleTextInput(codePoint: number, timeStamp: number): Feedback {
    const feedback = this.textInput.step(codePoint, timeStamp);
    this.lines = this.textInput.getLines();
    if (this.textInput.completed) {
      this.appendResult(
        Result.fromStats(
          this.settings.get(keyboardProps.layout),
          this.settings.get(lessonProps.type).textType,
          Date.now(),
          newStats(this.textInput.getSteps()),
        ),
      );
    }
    return feedback;
  }

  private _reset(fragment: string): void {
    this.textInput = new TextInput(fragment, this.textInputSettings);
    this.lines = this.textInput.getLines();
  }

  private _computeAnnouncements(): void {
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
