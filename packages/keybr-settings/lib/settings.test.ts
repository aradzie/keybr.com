import { Layout } from "@keybr/layout";
import {
  CaretMovementStyle,
  CaretShapeStyle,
  WhitespaceStyle,
} from "@keybr/textinput-settings";
import test from "ava";
import { LessonType } from "./lessontype.ts";
import { Settings } from "./settings.ts";
import { SpeedUnit } from "./units.ts";

test("default values", (t) => {
  const settings = new Settings();

  t.deepEqual(
    {
      ...settings,
    },
    {
      layout: Layout.EN_US,
      emulateLayout: false,
      lessonType: LessonType.GUIDED,
      lessonComplexity: 0,
      lessonLength: 0,
      lessonCapitals: false,
      lessonPunctuators: false,
      lessonDailyGoal: 30,
      textContent: "The quick brown fox jumps over the lazy dog.",
      textSimplify: true,
      textLowercase: true,
      stopOnError: true,
      forgiveErrors: true,
      caretShapeStyle: CaretShapeStyle.Underline,
      caretMovementStyle: CaretMovementStyle.Smooth,
      whitespaceStyle: WhitespaceStyle.Bullet,
      sounds: false,
      speedUnit: SpeedUnit.WPM,
      isNew: false,
    },
  );
});

test("toJSON", (t) => {
  t.deepEqual(new Settings().toJSON(), {
    "layout": "us",
    "emulateLayout": false,
    "lesson.type": "guided",
    "lesson.complexity": 0,
    "lesson.length": 0,
    "lesson.capitals": false,
    "lesson.punctuators": false,
    "lesson.dailyGoal": 30,
    "text.content": "The quick brown fox jumps over the lazy dog.",
    "text.simplify": true,
    "text.lowercase": true,
    "textInput.stopOnError": true,
    "textInput.forgiveErrors": true,
    "textDisplay.caretShapeStyle": "underline",
    "textDisplay.caretMovementStyle": "smooth",
    "textDisplay.whitespaceStyle": "bullet",
    "textDisplay.sounds": false,
    "ui.speedUnit": "wpm",
  });
  t.deepEqual(
    new Settings({
      layout: Layout.EN_US_DVORAK,
      emulateLayout: true,
      lessonType: LessonType.CUSTOM,
      lessonComplexity: 1,
      lessonLength: 1,
      lessonCapitals: true,
      lessonPunctuators: true,
      lessonDailyGoal: 30,
      textContent: "custom text content",
      textSimplify: false,
      textLowercase: false,
      stopOnError: false,
      forgiveErrors: false,
      caretShapeStyle: CaretShapeStyle.Underline,
      caretMovementStyle: CaretMovementStyle.Jumping,
      whitespaceStyle: WhitespaceStyle.Bullet,
      sounds: true,
      speedUnit: SpeedUnit.CPM,
    }).toJSON(),
    {
      "layout": "us-dvorak",
      "emulateLayout": true,
      "lesson.type": "custom",
      "lesson.complexity": 1,
      "lesson.length": 1,
      "lesson.capitals": true,
      "lesson.punctuators": true,
      "lesson.dailyGoal": 30,
      "text.content": "custom text content",
      "text.simplify": false,
      "text.lowercase": false,
      "textInput.stopOnError": false,
      "textInput.forgiveErrors": false,
      "textDisplay.caretShapeStyle": "underline",
      "textDisplay.caretMovementStyle": "jumping",
      "textDisplay.whitespaceStyle": "bullet",
      "textDisplay.sounds": true,
      "ui.speedUnit": "cpm",
    },
  );
});

test("fromJSON", (t) => {
  t.deepEqual(Settings.fromJSON(null), new Settings());
  t.deepEqual(Settings.fromJSON(""), new Settings());
  t.deepEqual(Settings.fromJSON([]), new Settings());
  t.deepEqual(Settings.fromJSON({}), new Settings());
  t.deepEqual(
    Settings.fromJSON({
      layout: "omg",
      lessonType: "omg",
    }),
    new Settings(),
  );
  t.deepEqual(
    Settings.fromJSON({
      "lesson.complexity": 100,
      "lesson.length": 100,
    }),
    new Settings({
      lessonComplexity: 0,
      lessonLength: 0,
    }),
  );
  t.deepEqual(
    Settings.fromJSON({
      "layout": "us",
      "emulateLayout": false,
      "lesson.type": "guided",
      "lesson.complexity": 0,
      "lesson.length": 0,
      "lesson.capitals": false,
      "lesson.punctuators": false,
      "lesson.dailyGoal": 30,
      "text.content": "The quick brown fox jumps over the lazy dog.",
      "text.simplify": true,
      "text.lowercase": true,
      "textInput.stopOnError": true,
      "textInput.forgiveErrors": true,
      "textDisplay.caretShapeStyle": "underline",
      "textDisplay.caretMovementStyle": "smooth",
      "textDisplay.whitespaceStyle": "bullet",
      "textDisplay.sounds": false,
      "ui.speedUnit": "wpm",
    }),
    new Settings(),
  );
  t.deepEqual(
    Settings.fromJSON({
      "layout": "us-dvorak",
      "emulateLayout": true,
      "lesson.type": "custom",
      "lesson.complexity": 1,
      "lesson.length": 1,
      "lesson.capitals": true,
      "lesson.punctuators": true,
      "lesson.dailyGoal": 30,
      "text.content": "custom text content",
      "text.simplify": false,
      "text.lowercase": false,
      "textInput.stopOnError": false,
      "textInput.forgiveErrors": false,
      "textDisplay.caretShapeStyle": "block",
      "textDisplay.caretMovementStyle": "jumping",
      "textDisplay.whitespaceStyle": "bullet",
      "textDisplay.sounds": true,
      "ui.speedUnit": "cpm",
    }),
    new Settings({
      layout: Layout.EN_US_DVORAK,
      emulateLayout: true,
      lessonType: LessonType.CUSTOM,
      lessonComplexity: 1,
      lessonLength: 1,
      lessonCapitals: true,
      lessonPunctuators: true,
      lessonDailyGoal: 30,
      textContent: "custom text content",
      textSimplify: false,
      textLowercase: false,
      stopOnError: false,
      forgiveErrors: false,
      caretShapeStyle: CaretShapeStyle.Block,
      caretMovementStyle: CaretMovementStyle.Jumping,
      whitespaceStyle: WhitespaceStyle.Bullet,
      sounds: true,
      speedUnit: SpeedUnit.CPM,
    }),
  );
});
