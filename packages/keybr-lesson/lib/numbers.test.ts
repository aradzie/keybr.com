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
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[1],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[2],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[3],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[4],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[5],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[6],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[7],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[8],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: Letter.digits[9],
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      confidence: null,
      bestConfidence: null,
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
        benford: true,
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

  {
    const model = new FakePhoneticModel();
    const lesson = new NumbersLesson(
      new Settings({
        benford: false,
      }),
      model,
      allCodePoints,
    );
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "460 7036 460 7036 460 7036 460 7036 460 7036 460 7036 460 7036 460",
    );
  }
});
