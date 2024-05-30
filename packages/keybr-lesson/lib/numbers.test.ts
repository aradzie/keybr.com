import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel, Letter } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import test from "ava";
import { LessonKey } from "./key.ts";
import { NumbersLesson } from "./numbers.ts";
import { lessonProps } from "./settings.ts";

test("provide key set", (t) => {
  const settings = new Settings();
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();
  const lesson = new NumbersLesson(settings, keyboard, model);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  t.deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: Letter.digits[0],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[1],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[2],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[3],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[4],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[5],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[6],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[7],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[8],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[9],
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: false,
      isForced: false,
    }),
  ]);
  t.deepEqual(lessonKeys.findExcludedKeys(), []);
  t.is(lessonKeys.findFocusedKey(), null);
});

test("generate text using settings", (t) => {
  {
    const settings = new Settings().set(lessonProps.numbers.benford, true);
    const keyboard = loadKeyboard(Layout.EN_US);
    const model = new FakePhoneticModel();
    const lesson = new NumbersLesson(settings, keyboard, model);
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "260 4036 260 4036 260 4036 260 4036 260 4036 260 4036 260 4036 260",
    );
  }

  {
    const settings = new Settings().set(lessonProps.numbers.benford, false);
    const keyboard = loadKeyboard(Layout.EN_US);
    const model = new FakePhoneticModel();
    const lesson = new NumbersLesson(settings, keyboard, model);
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "460 7036 460 7036 460 7036 460 7036 460 7036 460 7036 460 7036 460",
    );
  }
});
