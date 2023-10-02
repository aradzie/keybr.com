import { Layout } from "@keybr/layout";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  WhitespaceStyle,
} from "@keybr/textinput-settings";
import { defaults } from "./defaults.ts";
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
  [
    "layout", //
    itemValue("layout", Layout.ALL, defaults.layout),
  ],
  [
    "emulateLayout", //
    booleanValue("emulateLayout", defaults.emulateLayout),
  ],
  [
    "lessonType", //
    itemValue("lesson.type", LessonType.ALL, defaults.lessonType),
  ],
  [
    "lessonComplexity", //
    numberValue("lesson.complexity", defaults.lessonComplexity, clamp(0, 1)),
  ],
  [
    "lessonLength", //
    numberValue("lesson.length", defaults.lessonLength, clamp(0, 1)),
  ],
  [
    "lessonCapitals", //
    booleanValue("lesson.capitals", defaults.lessonCapitals),
  ],
  [
    "lessonPunctuators", //
    booleanValue("lesson.punctuators", defaults.lessonPunctuators),
  ],
  [
    "wordListSize", //
    numberValue("lesson.wordListSize", defaults.wordListSize, clamp(10, 1000)),
  ],
  [
    "textContent", //
    stringValue("lesson.text.content", defaults.textContent, maxLength(10_000)),
  ],
  [
    "textSimplify", //
    booleanValue("lesson.text.simplify", defaults.textSimplify),
  ],
  [
    "textLowercase", //
    booleanValue("lesson.text.lowercase", defaults.textLowercase),
  ],
  [
    "textRandomize", //
    booleanValue("lesson.text.randomize", defaults.textRandomize),
  ],
  [
    "dailyGoal", //
    numberValue("lesson.dailyGoal", defaults.dailyGoal, clamp(0, 120)),
  ],
  [
    "stopOnError", //
    booleanValue("textInput.stopOnError", defaults.stopOnError),
  ],
  [
    "forgiveErrors", //
    booleanValue("textInput.forgiveErrors", defaults.forgiveErrors),
  ],
  [
    "caretShapeStyle", //
    enumValue(
      "textDisplay.caretShapeStyle",
      CaretShapeStyle,
      defaults.caretShapeStyle,
    ),
  ],
  [
    "caretMovementStyle", //
    enumValue(
      "textDisplay.caretMovementStyle",
      CaretMovementStyle,
      defaults.caretMovementStyle,
    ),
  ],
  [
    "whitespaceStyle", //
    enumValue(
      "textDisplay.whitespaceStyle",
      WhitespaceStyle,
      defaults.whitespaceStyle,
    ),
  ],
  [
    "sounds", //
    booleanValue("textDisplay.sounds", defaults.sounds),
  ],
  [
    "speedUnit", //
    itemValue("ui.speedUnit", SpeedUnit.ALL, defaults.speedUnit),
  ],
];
