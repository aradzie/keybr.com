import { test } from "node:test";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { deepEqual } from "rich-assert";
import { LessonKey, LessonKeys } from "./key.ts";

const { letter1, letter2, letter3 } = FakePhoneticModel;

test("mutate lesson keys", () => {
  // Arrange.

  const keys = new LessonKeys([
    new LessonKey({
      letter: letter1,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
    }),
    new LessonKey({
      letter: letter2,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
    }),
    new LessonKey({
      letter: letter3,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
    }),
  ]);

  // Act.

  keys.focus(letter1);

  // Assert.

  deepEqual(keys.letters, [letter1, letter2, letter3]);
  deepEqual(
    [...keys],
    [
      new LessonKey({
        letter: letter1,
        samples: [],
        timeToType: 300,
        bestTimeToType: 300,
        confidence: 1.0,
        bestConfidence: 1.0,
        isIncluded: true,
        isForced: false,
        isFocused: true,
      }),
      new LessonKey({
        letter: letter2,
        samples: [],
        timeToType: 300,
        bestTimeToType: 300,
        confidence: 1.0,
        bestConfidence: 1.0,
        isIncluded: false,
        isForced: false,
        isFocused: false,
      }),
      new LessonKey({
        letter: letter3,
        samples: [],
        timeToType: 300,
        bestTimeToType: 300,
        confidence: 1.0,
        bestConfidence: 1.0,
        isIncluded: false,
        isForced: false,
        isFocused: false,
      }),
    ],
  );
  deepEqual(keys.findIncludedKeys(), [
    new LessonKey({
      letter: letter1,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: true,
      isForced: false,
      isFocused: true,
    }),
  ]);
  deepEqual(keys.findExcludedKeys(), [
    new LessonKey({
      letter: letter2,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: false,
      isForced: false,
      isFocused: false,
    }),
    new LessonKey({
      letter: letter3,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: false,
      isForced: false,
      isFocused: false,
    }),
  ]);
  deepEqual(
    keys.findFocusedKey(),
    new LessonKey({
      letter: letter1,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: true,
      isForced: false,
      isFocused: true,
    }),
  );
});
