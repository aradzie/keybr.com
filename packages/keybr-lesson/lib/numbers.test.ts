import { FakePhoneticModel, Letter } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import test from "ava";
import { LessonKey } from "./key.ts";
import { NumbersLesson } from "./numbers.ts";

const allCodePoints = { has: () => true };

test("provide key set", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel();
  const lesson = new NumbersLesson(settings, model, allCodePoints);
  const lessonKeys = lesson.update(lesson.analyze([]));

  t.deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: Letter.digits[0],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[1],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[2],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[3],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[4],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[5],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[6],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[7],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[8],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[9],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
  ]);
  t.deepEqual(lessonKeys.findExcludedKeys(), []);
  t.is(lessonKeys.findBoostedKey(), null);
});

test("generate text using settings", (t) => {
  {
    const model = new FakePhoneticModel();
    const lesson = new NumbersLesson(
      new Settings({
        lessonCapitals: false,
        lessonPunctuators: false,
      }),
      model,
      allCodePoints,
    );
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "260 4036 260 4036 260 4036 260 4036 260 4036 260 4036 260 4036 260",
    );
  }
});
