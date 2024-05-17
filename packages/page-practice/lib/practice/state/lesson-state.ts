import { keyboardProps, type KeyId } from "@keybr/keyboard";
import {
  type DailyGoal,
  type Lesson,
  type LessonKeys,
  lessonProps,
  makeDailyGoal,
} from "@keybr/lesson";
import {
  type KeyStatsMap,
  LocalDate,
  makeKeyStatsMap,
  makeSummaryStats,
  Result,
  ResultGroups,
  type SummaryStats,
} from "@keybr/result";
import { type Settings } from "@keybr/settings";
import {
  type Feedback,
  type LineList,
  makeStats,
  type TextDisplaySettings,
  TextInput,
  type TextInputSettings,
  toTextDisplaySettings,
  toTextInputSettings,
} from "@keybr/textinput";
import { type TextInputEvent } from "@keybr/textinput-events";
import { type CodePoint } from "@keybr/unicode";
import { type LastLesson } from "./last-lesson.ts";

export class LessonState {
  readonly textInputSettings: TextInputSettings;
  readonly textDisplaySettings: TextDisplaySettings;
  readonly keyStatsMap: KeyStatsMap;
  readonly lessonKeys: LessonKeys;
  readonly summaryStats: SummaryStats;
  readonly dailyGoal: DailyGoal;

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
    this.textInputSettings = toTextInputSettings(settings);
    this.textDisplaySettings = toTextDisplaySettings(settings);
    this.keyStatsMap = makeKeyStatsMap(this.lesson.letters, this.results);
    this.lessonKeys = this.lesson.update(this.keyStatsMap);
    this.summaryStats = makeSummaryStats(results);
    this.dailyGoal = makeDailyGoal(
      settings,
      ResultGroups.byDate(results).get(LocalDate.now()),
    );
    this.#reset(this.lesson.generate(this.lessonKeys));
  }

  resetLesson() {
    this.#reset(this.textInput.text);
  }

  skipLesson() {
    this.#reset(this.lesson.generate(this.lessonKeys));
  }

  onTextInput(event: TextInputEvent): Feedback {
    const feedback = this.textInput.onTextInput(event);
    this.lines = this.textInput.getLines();
    this.suffix = this.textInput.getSuffix();
    if (this.textInput.completed) {
      this.appendResult(this.#makeResult());
    }
    return feedback;
  }

  #reset(fragment: string) {
    this.textInput = new TextInput(fragment, this.textInputSettings);
    this.lines = this.textInput.getLines();
    this.suffix = this.textInput.getSuffix();
  }

  #makeResult(timeStamp = Date.now()) {
    return Result.fromStats(
      this.settings.get(keyboardProps.layout),
      this.settings.get(lessonProps.type).textType,
      timeStamp,
      makeStats(this.textInput.getSteps()),
    );
  }
}
