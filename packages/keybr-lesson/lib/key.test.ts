import { FakePhoneticModel } from "@keybr/phonetic-model";
import test from "ava";
import { MAX_TIME, MIN_TIME } from "./confidence.ts";
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
    timeToType: MIN_TIME + 10,
    bestTimeToType: MIN_TIME,
  });
  const b = new LessonKey({
    letter: letter2,
    samples: [],
    timeToType: MIN_TIME + 10,
    bestTimeToType: MIN_TIME,
  });
  const c = new LessonKey({
    letter: letter3,
    samples: [],
    timeToType: MIN_TIME + 10,
    bestTimeToType: MIN_TIME,
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
    timeToType: MAX_TIME,
    bestTimeToType: MAX_TIME - 30,
  });
  const b = new LessonKey({
    letter: letter2,
    samples: [],
    timeToType: MAX_TIME,
    bestTimeToType: MAX_TIME - 20,
  });
  const c = new LessonKey({
    letter: letter3,
    samples: [],
    timeToType: MAX_TIME,
    bestTimeToType: MAX_TIME - 10,
  });

  // Assert.

  t.is(LessonKey.findBoosted([a]), a);
  t.is(LessonKey.findBoosted([b]), b);
  t.is(LessonKey.findBoosted([c]), c);
  t.is(LessonKey.findBoosted([a, b, c]), c);
  t.is(LessonKey.findBoosted([c, b, a]), c);
});

test("lesson keys", (t) => {
  // Arrange.

  const keys = new LessonKeys([
    new LessonKey({
      letter: letter1,
      samples: [],
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
    }),
    new LessonKey({
      letter: letter2,
      samples: [],
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
    }),
    new LessonKey({
      letter: letter3,
      samples: [],
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
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
        timeToType: MIN_TIME,
        bestTimeToType: MIN_TIME,
        isIncluded: true,
        isForced: false,
        isBoosted: true,
      }),
      new LessonKey({
        letter: letter2,
        samples: [],
        timeToType: MIN_TIME,
        bestTimeToType: MIN_TIME,
        isIncluded: false,
        isForced: false,
        isBoosted: false,
      }),
      new LessonKey({
        letter: letter3,
        samples: [],
        timeToType: MIN_TIME,
        bestTimeToType: MIN_TIME,
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
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
      isIncluded: true,
      isForced: false,
      isBoosted: true,
    }),
  ]);
  t.deepEqual(keys.findExcludedKeys(), [
    new LessonKey({
      letter: letter2,
      samples: [],
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
      isIncluded: false,
      isForced: false,
      isBoosted: false,
    }),
    new LessonKey({
      letter: letter3,
      samples: [],
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
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
      timeToType: MIN_TIME,
      bestTimeToType: MIN_TIME,
      isIncluded: true,
      isForced: false,
      isBoosted: true,
    }),
  );
});
