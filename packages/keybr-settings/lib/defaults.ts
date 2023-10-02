import { Layout } from "@keybr/layout";
import {
  textDisplaySettings,
  textInputSettings,
} from "@keybr/textinput-settings";
import { LessonType } from "./lessontype.ts";
import { type AllSettings } from "./types.ts";
import { SpeedUnit } from "./units.ts";

export const defaults = Object.freeze<AllSettings>({
  layout: Layout.getDefault(),
  emulateLayout: false,
  lessonType: LessonType.GUIDED,
  lessonComplexity: 0,
  lessonLength: 0,
  lessonCapitals: false,
  lessonPunctuators: false,
  wordListSize: 1000,
  textContent: "The quick brown fox jumps over the lazy dog.",
  textSimplify: true,
  textLowercase: true,
  dailyGoal: 30,
  stopOnError: textInputSettings.stopOnError,
  forgiveErrors: textInputSettings.forgiveErrors,
  caretShapeStyle: textDisplaySettings.caretShapeStyle,
  caretMovementStyle: textDisplaySettings.caretMovementStyle,
  whitespaceStyle: textDisplaySettings.whitespaceStyle,
  sounds: false,
  speedUnit: SpeedUnit.WPM,
});
