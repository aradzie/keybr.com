import { FakePhoneticModel } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { CustomTextLesson } from "./customtext.ts";
import { LessonKey } from "./key.ts";

const allCodePoints = { has: () => true };

test("provide key set", (t) => {
  const settings = new Settings({ textContent: "example test" });
  const model = new FakePhoneticModel();
  const lesson = new CustomTextLesson(settings, model, allCodePoints);
  const lessonKeys = lesson.update(lesson.analyze([]));

  t.deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter2,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter3,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter4,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter5,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter6,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter7,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter8,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter9,
      samples: [],
      timeToType: NaN,
      bestTimeToType: NaN,
      isIncluded: true,
      isBoosted: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter10,
      samples: [],
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

test("generate text with empty settings", (t) => {
  const settings = new Settings({ textContent: "" });
  const model = new FakePhoneticModel();
  const lesson = new CustomTextLesson(settings, model, allCodePoints);
  lesson.update(lesson.analyze([]));

  t.is(
    lesson.generate(),
    "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ? " +
      "? ? ? ? ? ? ? ? ? ?",
  );
});

test("generate text using settings", (t) => {
  {
    const model = new FakePhoneticModel();
    const codePoints = new Set(toCodePoints("abcdefABCDEF123!?"));
    const lesson = new CustomTextLesson(
      new Settings({
        textContent: "Abc! Def? 123",
        textLowercase: true,
        textSimplify: true,
        textRandomize: false,
      }),
      model,
      codePoints,
    );
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "abc def abc def abc def abc def abc def abc def abc def abc def abc " +
        "def abc def abc def abc def abc def abc def abc def abc def abc def",
    );
  }

  {
    const model = new FakePhoneticModel();
    const codePoints = new Set(toCodePoints("abcdefABCDEF123!?"));
    const lesson = new CustomTextLesson(
      new Settings({
        textContent: "Abc! Def? 123",
        textLowercase: false,
        textSimplify: false,
        textRandomize: false,
      }),
      model,
      codePoints,
    );
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 " +
        "Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc!",
    );
  }
});

test("generate randomized text using settings", (t) => {
  {
    const model = new FakePhoneticModel();
    const codePoints = new Set(toCodePoints("abcdefABCDEF123!?"));
    const lesson = new CustomTextLesson(
      new Settings({
        textContent: "Abc! Def? 123 AAA aaa BBB bbb CCC ccc",
        textLowercase: true,
        textSimplify: true,
        textRandomize: true,
      }),
      model,
      codePoints,
    );
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa " +
        "bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc",
    );
  }

  {
    const model = new FakePhoneticModel();
    const codePoints = new Set(toCodePoints("abcdefABCDEF123!?"));
    const lesson = new CustomTextLesson(
      new Settings({
        textContent: "Abc! Def? 123 AAA aaa BBB bbb CCC ccc",
        textLowercase: false,
        textSimplify: false,
        textRandomize: true,
      }),
      model,
      codePoints,
    );
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! " +
        "AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb",
    );
  }
});
