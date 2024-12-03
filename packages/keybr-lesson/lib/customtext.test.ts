import { describe, it, test } from "node:test";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import { deepEqual, equal, isNull } from "rich-assert";
import { CustomTextLesson } from "./customtext.ts";
import { LessonKey } from "./key.ts";
import { lessonProps } from "./settings.ts";

test("provide key set", () => {
  const settings = new Settings();
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();
  const lesson = new CustomTextLesson(settings, keyboard, model);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter1,
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
      letter: FakePhoneticModel.letter2,
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
      letter: FakePhoneticModel.letter3,
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
      letter: FakePhoneticModel.letter4,
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
      letter: FakePhoneticModel.letter5,
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
      letter: FakePhoneticModel.letter6,
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
      letter: FakePhoneticModel.letter7,
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
      letter: FakePhoneticModel.letter8,
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
      letter: FakePhoneticModel.letter9,
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
      letter: FakePhoneticModel.letter10,
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
  deepEqual(lessonKeys.findExcludedKeys(), []);
  isNull(lessonKeys.findFocusedKey());
});

test("generate text with empty settings", () => {
  const settings = new Settings().set(lessonProps.customText.content, "");
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();
  const lesson = new CustomTextLesson(settings, keyboard, model);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  equal(
    lesson.generate(lessonKeys, model.rng),
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

describe("generate text using settings", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  it("should transform to lower case", () => {
    const settings = new Settings()
      .set(lessonProps.customText.content, "Abc! Def? 123")
      .set(lessonProps.customText.lowercase, true)
      .set(lessonProps.customText.lettersOnly, true)
      .set(lessonProps.customText.randomize, false);
    const model = new FakePhoneticModel();
    const lesson = new CustomTextLesson(settings, keyboard, model);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "abc def abc def abc def abc def abc def abc def abc def abc def abc " +
        "def abc def abc def abc def abc def abc def abc def abc def abc def",
    );
  });

  it("should preserve case", () => {
    const settings = new Settings()
      .set(lessonProps.customText.content, "Abc! Def? 123")
      .set(lessonProps.customText.lowercase, false)
      .set(lessonProps.customText.lettersOnly, false)
      .set(lessonProps.customText.randomize, false);
    const model = new FakePhoneticModel();
    const lesson = new CustomTextLesson(settings, keyboard, model);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 " +
        "Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc! Def? 123 Abc!",
    );
  });
});

describe("generate randomized text using settings", () => {
  const keyboard = loadKeyboard(Layout.EN_US);

  it("should transform to lower case", () => {
    const settings = new Settings()
      .set(
        lessonProps.customText.content,
        "Abc! Def? 123 AAA aaa BBB bbb CCC ccc",
      )
      .set(lessonProps.customText.lowercase, true)
      .set(lessonProps.customText.lettersOnly, true)
      .set(lessonProps.customText.randomize, true);
    const model = new FakePhoneticModel();
    const lesson = new CustomTextLesson(settings, keyboard, model);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa " +
        "bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc aaa bbb abc",
    );
  });

  it("should preserve case", () => {
    const settings = new Settings()
      .set(
        lessonProps.customText.content,
        "Abc! Def? 123 AAA aaa BBB bbb CCC ccc",
      )
      .set(lessonProps.customText.lowercase, false)
      .set(lessonProps.customText.lettersOnly, false)
      .set(lessonProps.customText.randomize, true);
    const model = new FakePhoneticModel();
    const lesson = new CustomTextLesson(settings, keyboard, model);
    const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

    equal(
      lesson.generate(lessonKeys, model.rng),
      "Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! " +
        "AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb Abc! AAA bbb",
    );
  });
});
