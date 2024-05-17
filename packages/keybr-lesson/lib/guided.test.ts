import { allCodePoints } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { makeKeyStatsMap } from "@keybr/result";
import { Settings } from "@keybr/settings";
import test from "ava";
import { GuidedLesson } from "./guided.ts";
import { LessonKey } from "./key.ts";
import { lessonProps } from "./settings.ts";

test("provide key set", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, model, allCodePoints(), []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));

  t.deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter10,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: true,
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
  ]);
  t.deepEqual(lessonKeys.findExcludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter4,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
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
      isIncluded: false,
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
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: false,
      isFocused: false,
      isForced: false,
    }),
  ]);
  t.deepEqual(
    lessonKeys.findFocusedKey(),
    new LessonKey({
      letter: FakePhoneticModel.letter10,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isFocused: true,
      isForced: false,
    }),
  );
});

test("generate text from a broken phonetic model, empty words", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel([""]);
  const lesson = new GuidedLesson(settings, model, allCodePoints(), []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
  lesson.rng = model.rng;

  t.is(
    lesson.generate(lessonKeys),
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

test("generate text from a broken phonetic model, repeating words", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel(["x"]);
  const lesson = new GuidedLesson(settings, model, allCodePoints(), []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
  lesson.rng = model.rng;

  t.is(
    lesson.generate(lessonKeys),
    "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x " +
      "x x x x x x x x x x",
  );
});

test("generate text with pseudo words", (t) => {
  const settings = new Settings().set(lessonProps.guided.naturalWords, false);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, model, allCodePoints(), []);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
  lesson.rng = model.rng;

  t.is(
    lesson.generate(lessonKeys),
    "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno due tre " +
      "uno",
  );
});

test("generate text with natural words", (t) => {
  const settings = new Settings().set(lessonProps.guided.naturalWords, true);
  const model = new FakePhoneticModel(["uno", "due", "tre"]);
  const lesson = new GuidedLesson(settings, model, allCodePoints(), [
    "efghijee",
    "efghijef",
    "efghijeg",
    "efghijeh",
    "efghijei",
    "efghijej",
    "efghijfe",
    "efghijff",
    "efghijfg",
    "efghijfh",
    "efghijfi",
    "efghijfj",
    "efghijge",
    "efghijgf",
    "efghijgg",
  ]);
  const lessonKeys = lesson.update(makeKeyStatsMap(lesson.letters, []));
  lesson.rng = model.rng;

  t.is(
    lesson.generate(lessonKeys),
    "efghijee efghijej efghijfi efghijee efghijej efghijfi efghijee " +
      "efghijej efghijfi efghijee efghijej efghijfi efghijee",
  );
});
