import { Layout } from "@keybr/layout";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  textDisplaySettings,
  textInputSettings,
  WhitespaceStyle,
} from "@keybr/textinput-settings";
import {
  booleanValue,
  clamp,
  enumValue,
  itemValue,
  maxLength,
  numberValue,
  type SettingsValue,
  stringValue,
} from "./json.ts";
import { LessonType } from "./lessontype.ts";
import { type AllSettings } from "./types.ts";
import { SpeedUnit } from "./units.ts";

export const MAPPING: readonly [
  propertyName: keyof AllSettings,
  settingsValue: SettingsValue<unknown>,
][] = [
  ["layout", itemValue("layout", Layout.ALL, Layout.getDefault())],
  ["emulateLayout", booleanValue("emulateLayout", false)],
  ["lessonType", itemValue("lesson.type", LessonType.ALL, LessonType.GUIDED)],
  ["lessonComplexity", numberValue("lesson.complexity", 0, clamp(0, 1))],
  ["lessonLength", numberValue("lesson.length", 0, clamp(0, 1))],
  ["lessonCapitals", booleanValue("lesson.capitals", false)],
  ["lessonPunctuators", booleanValue("lesson.punctuators", false)],
  ["lessonDailyGoal", numberValue("lesson.dailyGoal", 30, clamp(0, 120))],
  ["textContent", stringValue("text.content", "", maxLength(50_000))],
  ["textSimplify", booleanValue("text.simplify", true)],
  ["textLowercase", booleanValue("text.lowercase", true)],
  [
    "stopOnError",
    booleanValue("textInput.stopOnError", textInputSettings.stopOnError),
  ],
  [
    "forgiveErrors",
    booleanValue("textInput.forgiveErrors", textInputSettings.forgiveErrors),
  ],
  [
    "caretShapeStyle",
    enumValue(
      "textDisplay.caretShapeStyle",
      CaretShapeStyle,
      textDisplaySettings.caretShapeStyle,
    ),
  ],
  [
    "caretMovementStyle",
    enumValue(
      "textDisplay.caretMovementStyle",
      CaretMovementStyle,
      textDisplaySettings.caretMovementStyle,
    ),
  ],
  [
    "whitespaceStyle",
    enumValue(
      "textDisplay.whitespaceStyle",
      WhitespaceStyle,
      textDisplaySettings.whitespaceStyle,
    ),
  ],
  ["sounds", booleanValue("textDisplay.sounds", false)],
  ["speedUnit", itemValue("ui.speedUnit", SpeedUnit.ALL, SpeedUnit.WPM)],
];
