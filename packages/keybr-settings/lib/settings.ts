import { Layout } from "@keybr/layout";
import {
  type CaretMovementStyle,
  type CaretShapeStyle,
  textDisplaySettings,
  textInputSettings,
  type WhitespaceStyle,
} from "@keybr/textinput-settings";
import isPlainObject from "lodash/isPlainObject";
import { LessonType } from "./lessontype.ts";
import { MAPPING } from "./mapping.ts";
import { type AllSettings } from "./types.ts";
import { SpeedUnit } from "./units.ts";

export type SettingsStorage = {
  load(): Promise<Settings>;
  store(settings: Settings): Promise<Settings>;
};

export class Settings implements AllSettings {
  readonly layout: Layout;
  readonly emulateLayout: boolean;
  readonly lessonType: LessonType;
  readonly lessonComplexity: number;
  readonly lessonLength: number;
  readonly lessonCapitals: boolean;
  readonly lessonPunctuators: boolean;
  readonly lessonDailyGoal: number;
  readonly textContent: string;
  readonly textSimplify: boolean;
  readonly textLowercase: boolean;
  readonly stopOnError: boolean;
  readonly forgiveErrors: boolean;
  readonly caretShapeStyle: CaretShapeStyle;
  readonly caretMovementStyle: CaretMovementStyle;
  readonly whitespaceStyle: WhitespaceStyle;
  readonly sounds: boolean;
  readonly speedUnit: SpeedUnit;
  readonly isNew: boolean;

  constructor(
    {
      layout = Layout.getDefault(),
      emulateLayout = false,
      lessonType = LessonType.GUIDED,
      lessonComplexity = 0,
      lessonLength = 0,
      lessonCapitals = false,
      lessonPunctuators = false,
      lessonDailyGoal = 30,
      textContent = "",
      textSimplify = true,
      textLowercase = true,
      stopOnError = textInputSettings.stopOnError,
      forgiveErrors = textInputSettings.forgiveErrors,
      caretShapeStyle = textDisplaySettings.caretShapeStyle,
      caretMovementStyle = textDisplaySettings.caretMovementStyle,
      whitespaceStyle = textDisplaySettings.whitespaceStyle,
      sounds = false,
      speedUnit = SpeedUnit.WPM,
    }: Partial<AllSettings> = {},
    isNew: boolean = false,
  ) {
    this.layout = layout;
    this.emulateLayout = emulateLayout;
    this.lessonType = lessonType;
    this.lessonComplexity = lessonComplexity;
    this.lessonLength = lessonLength;
    this.lessonCapitals = lessonCapitals;
    this.lessonPunctuators = lessonPunctuators;
    this.lessonDailyGoal = lessonDailyGoal;
    this.textContent = textContent;
    this.textSimplify = textSimplify;
    this.textLowercase = textLowercase;
    this.stopOnError = stopOnError;
    this.forgiveErrors = forgiveErrors;
    this.caretShapeStyle = caretShapeStyle;
    this.caretMovementStyle = caretMovementStyle;
    this.whitespaceStyle = whitespaceStyle;
    this.sounds = sounds;
    this.speedUnit = speedUnit;
    this.isNew = isNew;
    Object.freeze(this);
  }

  patch({
    layout = this.layout,
    emulateLayout = this.emulateLayout,
    lessonType = this.lessonType,
    lessonComplexity = this.lessonComplexity,
    lessonLength = this.lessonLength,
    lessonCapitals = this.lessonCapitals,
    lessonPunctuators = this.lessonPunctuators,
    lessonDailyGoal = this.lessonDailyGoal,
    textContent = this.textContent,
    textSimplify = this.textSimplify,
    textLowercase = this.textLowercase,
    stopOnError = this.stopOnError,
    forgiveErrors = this.forgiveErrors,
    caretShapeStyle = this.caretShapeStyle,
    caretMovementStyle = this.caretMovementStyle,
    whitespaceStyle = this.whitespaceStyle,
    sounds = this.sounds,
    speedUnit = this.speedUnit,
  }: Partial<AllSettings>): Settings {
    return new Settings({
      layout,
      emulateLayout,
      lessonType,
      lessonComplexity,
      lessonLength,
      lessonCapitals,
      lessonPunctuators,
      lessonDailyGoal,
      textContent,
      textSimplify,
      textLowercase,
      stopOnError,
      forgiveErrors,
      caretShapeStyle,
      caretMovementStyle,
      whitespaceStyle,
      sounds,
      speedUnit,
    });
  }

  toJSON(): Record<string, unknown> {
    const entries: [string, unknown][] = [];
    for (const [propertyName, { key, toJson }] of MAPPING) {
      entries.push([key, toJson(this[propertyName])]);
    }
    return Object.fromEntries(entries);
  }

  static fromJSON(json: unknown): Settings {
    const entries: [string, unknown][] = [];
    if (isPlainObject(json)) {
      for (const [propertyName, { key, fromJson }] of MAPPING) {
        entries.push([propertyName, fromJson((json as any)[key] ?? null)]);
      }
    }
    return new Settings(Object.fromEntries(entries));
  }
}
