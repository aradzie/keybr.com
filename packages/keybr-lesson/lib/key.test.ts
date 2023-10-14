import { FakePhoneticModel } from "@keybr/phonetic-model";
import test from "ava";
import { LessonKey, LessonKeys } from "./key.ts";

const { letter1, letter2, letter3 } = FakePhoneticModel;

test("find boosted key in empty list", (t) => {
  // Assert.

  t.is(LessonKey.findBoosted([]), null);
});

test("find boosted key when all keys have max confidence", (t) => {
  // Arrange.

  const a = new LessonKey({
    letter: letter1,
    samples: [],
    timeToType: 100,
    bestTimeToType: 100,
    confidence: 0.1,
    bestConfidence: 1.0,
  });
  const b = new LessonKey({
    letter: letter2,
    samples: [],
    timeToType: 200,
    bestTimeToType: 200,
    confidence: 0.1,
    bestConfidence: 1.0,
  });
  const c = new LessonKey({
    letter: letter3,
    samples: [],
    timeToType: 300,
    bestTimeToType: 300,
    confidence: 0.1,
    bestConfidence: 1.0,
  });

  // Assert.

  t.is(LessonKey.findBoosted([a]), null);
  t.is(LessonKey.findBoosted([b]), null);
  t.is(LessonKey.findBoosted([c]), null);
  t.is(LessonKey.findBoosted([a, b, c]), null);
});

test("find boosted key with least confidence", (t) => {
  // Arrange.

  const a = new LessonKey({
    letter: letter1,
    samples: [],
    timeToType: 500,
    bestTimeToType: 500,
    confidence: 0.9,
    bestConfidence: 0.7,
  });
  const b = new LessonKey({
    letter: letter2,
    samples: [],
    timeToType: 400,
    bestTimeToType: 400,
    confidence: 0.8,
    bestConfidence: 0.8,
  });
  const c = new LessonKey({
    letter: letter3,
    samples: [],
    timeToType: 300,
    bestTimeToType: 300,
    confidence: 0.7,
    bestConfidence: 0.9,
  });

  // Assert.

  t.is(LessonKey.findBoosted([a]), a);
  t.is(LessonKey.findBoosted([b]), b);
  t.is(LessonKey.findBoosted([c]), c);
  t.is(LessonKey.findBoosted([a, b, c]), a);
  t.is(LessonKey.findBoosted([c, b, a]), a);
});

test("lesson keys", (t) => {
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

  keys.boost(letter1);

  // Assert.

  t.deepEqual(keys.letters, [letter1, letter2, letter3]);
  t.deepEqual(
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
        isBoosted: true,
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
        isBoosted: false,
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
        isBoosted: false,
      }),
    ],
  );
  t.deepEqual(keys.findIncludedKeys(), [
    new LessonKey({
      letter: letter1,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: true,
      isForced: false,
      isBoosted: true,
    }),
  ]);
  t.deepEqual(keys.findExcludedKeys(), [
    new LessonKey({
      letter: letter2,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: false,
      isForced: false,
      isBoosted: false,
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
      isBoosted: false,
    }),
  ]);
  t.deepEqual(
    keys.findBoostedKey(),
    new LessonKey({
      letter: letter1,
      samples: [],
      timeToType: 300,
      bestTimeToType: 300,
      confidence: 1.0,
      bestConfidence: 1.0,
      isIncluded: true,
      isForced: false,
      isBoosted: true,
    }),
  );
});
