import { test } from "node:test";
import { Layout } from "@keybr/keyboard";
import { deepEqual, equal, isFalse, isNull, isTrue } from "rich-assert";
import { HighScores, type HighScoresRow } from "./highscores.ts";

const now = new Date("2001-02-03T04:05:06Z");

const template = {
  user: 0,
  layout: Layout.EN_US,
  timeStamp: now,
  time: 0,
  length: 0,
  errors: 0,
  complexity: 0,
  speed: 0,
  score: 0,
} as const satisfies HighScoresRow;

test("do not insert if result is old", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const timeStamp = new Date(Number(now) - 1001);
  const candidate = {
    ...template,
    timeStamp,
    user: 1,
    speed: 100,
    score: 100,
  };

  const table = new HighScores([]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1000, maxAge: 1000 });

  // Assert.

  deepEqual([...table], []);
  isFalse(table.dirty);
  isNull(position);
});

test("do not insert if result is low", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const r0 = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 9,
    speed: 10,
    score: 10,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 3 });

  // Assert.

  deepEqual([...table], [r0, r1, r2]);
  isFalse(table.dirty);
  isNull(position);
});

test("do not insert if higher result exists ", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const r0 = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 1,
    speed: 10,
    score: 10,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1000 });

  // Assert.

  deepEqual([...table], [r0, r1, r2]);
  isFalse(table.dirty);
  isNull(position);
});

test("remove old results", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const timeStamp = new Date(Number(now) - 1001);

  const r0 = {
    ...template,
    timeStamp,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    timeStamp,
    user: 2,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    timeStamp,
    user: 3,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 9,
    speed: 10,
    score: 10,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1000, maxAge: 1000 });

  // Assert.

  deepEqual([...table], [candidate]);
  equal(table.dirty, true);
  equal(position, 0);
});

test("remove lower results", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const r0 = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    user: 1,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    user: 1,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 1,
    speed: 1000,
    score: 1000,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1000 });

  // Assert.

  deepEqual([...table], [candidate]);
  equal(table.dirty, true);
  equal(position, 0);
});

test("insert if result is high", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const r0 = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 9,
    speed: 1000,
    score: 1000,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1000 });

  // Assert.

  deepEqual([...table], [candidate, r0, r1, r2]);
  isTrue(table.dirty);
  equal(position, 0);
});

test("insert if table is not full", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const r0 = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 9,
    speed: 10,
    score: 10,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1000 });

  // Assert.

  deepEqual([...table], [r0, r1, r2, candidate]);
  isTrue(table.dirty);
  equal(position, 3);
});

test("truncate to limit", (ctx) => {
  // Arrange.

  ctx.mock.timers.enable({ apis: ["Date"], now });

  const r0 = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  } satisfies HighScoresRow;
  const r1 = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  } satisfies HighScoresRow;
  const r2 = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  } satisfies HighScoresRow;
  const candidate = {
    ...template,
    user: 9,
    speed: 1000,
    score: 1000,
  };

  const table = new HighScores([r0, r1, r2]);

  // Act.

  const position = table.insert(candidate, { maxSize: 1 });

  // Assert.

  deepEqual([...table], [candidate]);
  isTrue(table.dirty);
  equal(position, 0);
});
