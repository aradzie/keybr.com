import { FakePhoneticModel } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { LessonKey } from "./key.ts";
import { lessonProps } from "./settings.ts";
import { WordListLesson } from "./wordlist.ts";

const allCodePoints = { has: () => true };

test("provide key set", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel();
  const wordList = ["abc", "def", "ghi"];
  const lesson = new WordListLesson(settings, model, allCodePoints, wordList);
  const lessonKeys = lesson.update(lesson.analyze([]));

  t.deepEqual(lessonKeys.findIncludedKeys(), [
    new LessonKey({
      letter: FakePhoneticModel.letter1,
      samples: [],
      timeToType: null,
      bestTimeToType: null,
      confidence: null,
      bestConfidence: null,
      isIncluded: true,
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
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
      isBoosted: false,
      isForced: false,
    }),
  ]);
  t.deepEqual(lessonKeys.findExcludedKeys(), []);
  t.is(lessonKeys.findBoostedKey(), null);
});

test("filter words", (t) => {
  const settings = new Settings();
  const model = new FakePhoneticModel();
  const codePoints = new Set(toCodePoints("abcdefABCDEF123!?"));
  const wordList = ["abc", "def", "xyz", "abz", "xbc"];
  const lesson = new WordListLesson(settings, model, codePoints, wordList);

  t.deepEqual(lesson.wordList, ["abc", "def"]);
});

test("generate text using settings", (t) => {
  {
    const settings = new Settings()
      .set(lessonProps.capitals, 0)
      .set(lessonProps.punctuators, 0);
    const model = new FakePhoneticModel();
    const wordList = ["abc", "def", "ghi"];
    const lesson = new WordListLesson(settings, model, allCodePoints, wordList);
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "abc def ghi abc def ghi abc def ghi abc def ghi abc def ghi abc def " +
        "ghi abc def ghi abc def ghi abc def ghi abc def ghi abc def ghi abc",
    );
  }

  {
    const settings = new Settings()
      .set(lessonProps.capitals, 1)
      .set(lessonProps.punctuators, 1);
    const model = new FakePhoneticModel();
    const wordList = ["abc", "def", "ghi"];
    const lesson = new WordListLesson(settings, model, allCodePoints, wordList);
    lesson.update(lesson.analyze([]));
    lesson.rng = model.rng;

    t.is(
      lesson.generate(),
      "Abc! Def, Ghi. Abc! Def, Ghi. Abc! Def, Ghi. Abc! Def, Ghi. Abc! Def," +
        " Ghi. Abc! Def, Ghi. Abc! Def, Ghi. Abc! Def, Ghi. Abc!",
    );
  }
});
