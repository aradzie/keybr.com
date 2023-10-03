import { type Layout } from "@keybr/layout";
import {
  type CaretMovementStyle,
  type CaretShapeStyle,
  type WhitespaceStyle,
} from "@keybr/textinput-settings";
import isPlainObject from "lodash/isPlainObject";
import { defaults } from "./defaults.ts";
import { type LessonType } from "./lessontype.ts";
import { SCHEMA } from "./schema.ts";
import { type AllSettings } from "./types.ts";
import { type SpeedUnit } from "./units.ts";

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
  readonly wordListSize: number;
  readonly textContent: string;
  readonly textSimplify: boolean;
  readonly textLowercase: boolean;
  readonly textRandomize: boolean;
  readonly benford: boolean;
  readonly targetSpeed: number;
  readonly dailyGoal: number;
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
      layout = defaults.layout,
      emulateLayout = defaults.emulateLayout,
      lessonType = defaults.lessonType,
      lessonComplexity = defaults.lessonComplexity,
      lessonLength = defaults.lessonLength,
      lessonCapitals = defaults.lessonCapitals,
      lessonPunctuators = defaults.lessonPunctuators,
      wordListSize = defaults.wordListSize,
      textContent = defaults.textContent,
      textSimplify = defaults.textSimplify,
      textLowercase = defaults.textLowercase,
      textRandomize = defaults.textRandomize,
      benford = defaults.benford,
      targetSpeed = defaults.targetSpeed,
      dailyGoal = defaults.dailyGoal,
      stopOnError = defaults.stopOnError,
      forgiveErrors = defaults.forgiveErrors,
      caretShapeStyle = defaults.caretShapeStyle,
      caretMovementStyle = defaults.caretMovementStyle,
      whitespaceStyle = defaults.whitespaceStyle,
      sounds = defaults.sounds,
      speedUnit = defaults.speedUnit,
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
    this.wordListSize = wordListSize;
    this.textContent = textContent;
    this.textSimplify = textSimplify;
    this.textLowercase = textLowercase;
    this.textRandomize = textRandomize;
    this.benford = benford;
    this.targetSpeed = targetSpeed;
    this.dailyGoal = dailyGoal;
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
    wordListSize = this.wordListSize,
    textContent = this.textContent,
    textSimplify = this.textSimplify,
    textLowercase = this.textLowercase,
    textRandomize = this.textRandomize,
    benford = this.benford,
    targetSpeed = this.targetSpeed,
    dailyGoal = this.dailyGoal,
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
      wordListSize,
      textContent,
      textSimplify,
      textLowercase,
      textRandomize,
      benford,
      targetSpeed,
      dailyGoal,
      stopOnError,
      forgiveErrors,
      caretShapeStyle,
      caretMovementStyle,
      whitespaceStyle,
      sounds,
      speedUnit,
    });
  }

  toJSON(): unknown {
    const entries = [];
    for (const [prop, { key, toJson }] of Object.entries(SCHEMA)) {
      entries.push([key, toJson((this as any)[prop])]);
    }
    return Object.fromEntries(entries);
  }

  static fromJSON(json: unknown): Settings {
    const entries = [];
    if (isPlainObject(json)) {
      for (const [prop, { key, fromJson }] of Object.entries(SCHEMA)) {
        entries.push([prop, fromJson((json as any)[key] ?? null)]);
      }
    }
    return new Settings(Object.fromEntries(entries));
  }
}
