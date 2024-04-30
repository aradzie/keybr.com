import { keyboardProps, type KeyId, Ngram2 } from "@keybr/keyboard";
import { type Lesson, type LessonKeys, lessonProps } from "@keybr/lesson";
import { Histogram, KeySet } from "@keybr/math";
import { type KeyStatsMap, Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import {
  type Feedback,
  type LineList,
  newStats,
  type Step,
  type TextDisplaySettings,
  TextInput,
  type TextInputSettings,
  toTextDisplaySettings,
  toTextInputSettings,
} from "@keybr/textinput";
import { type TextInputEvent } from "@keybr/textinput-events";
import { type CodePoint, type HasCodePoint } from "@keybr/unicode";
import { type Announcement } from "./Announcer.tsx";

export type LastLesson = {
  readonly result: Result;
  readonly hits: Histogram<HasCodePoint>;
  readonly misses: Histogram<HasCodePoint>;
  readonly hits2: Ngram2;
  readonly misses2: Ngram2;
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
  suffix!: readonly CodePoint[]; // Mutable.
  depressedKeys: readonly KeyId[] = []; // Mutable.

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
    this.#reset(this.lesson.generate(this.lessonKeys));
    this.#computeAnnouncements();
  }

  resetLesson(): void {
    this.#reset(this.textInput.text);
  }

  skipLesson(): void {
    this.#reset(this.lesson.generate(this.lessonKeys));
  }

  onTextInput(event: TextInputEvent): Feedback {
    const feedback = this.textInput.onTextInput(event);
    this.lines = this.textInput.getLines();
    this.suffix = this.textInput.getSuffix();
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

  #reset(fragment: string): void {
    this.textInput = new TextInput(fragment, this.textInputSettings);
    this.lines = this.textInput.getLines();
    this.suffix = this.textInput.getSuffix();
  }

  #computeAnnouncements(): void {
    const { results, keyStatsMap, lessonKeys } = this;
    if (results.length > 0) {
      const focusedKey = lessonKeys.findFocusedKey();
      if (focusedKey != null) {
        const keyStats = keyStatsMap.get(focusedKey.letter);
        if (keyStats.samples.length === 0) {
          this.announcements.push({ lessonKey: focusedKey });
        }
      }
    }
  }
}

export function makeLastLesson(
  result: Result,
  steps: readonly Step[],
): LastLesson {
  const keySet = new KeySet<HasCodePoint>([]);
  const hits = new Histogram(keySet);
  const misses = new Histogram(keySet);
  for (const { codePoint, hitCount, missCount } of result.histogram) {
    hits.set({ codePoint }, hitCount);
    misses.set({ codePoint }, missCount);
  }
  const alphabet = [...new Set(steps.map(({ codePoint }) => codePoint))].sort(
    (a, b) => a - b,
  );
  const hits2 = new Ngram2(alphabet);
  const misses2 = new Ngram2(alphabet);
  for (let i = 0; i < steps.length - 1; i++) {
    hits2.add(steps[i].codePoint, steps[i + 1].codePoint, 1);
  }
  return { result, hits, misses, hits2, misses2 };
}
