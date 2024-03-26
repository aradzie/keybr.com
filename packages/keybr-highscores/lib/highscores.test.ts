import { Layout } from "@keybr/keyboard";
import { fake } from "@keybr/test-env-time";
import test from "ava";
import { HighScores, type HighScoresRow } from "./highscores.ts";

const now = new Date("2001-02-03T04:05:06Z");

const template: HighScoresRow = {
  user: 0,
  layout: Layout.EN_US,
  timeStamp: now,
  time: 0,
  length: 0,
  errors: 0,
  complexity: 0,
  speed: 0,
  score: 0,
};

test.beforeEach(() => {
  fake.date.set(now);
});

test.afterEach(() => {
  fake.date.reset();
});

test("do not insert if result is old", (t) => {
  // Arrange.

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

  t.deepEqual([...table], []);
  t.is(table.dirty, false);
  t.is(position, null);
});

test("do not insert if result is low", (t) => {
  // Arrange.

  const r0: HighScoresRow = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [r0, r1, r2]);
  t.is(table.dirty, false);
  t.is(position, null);
});

test("do not insert if higher result exists ", (t) => {
  // Arrange.

  const r0: HighScoresRow = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [r0, r1, r2]);
  t.is(table.dirty, false);
  t.is(position, null);
});

test("remove old results", (t) => {
  // Arrange.

  const timeStamp = new Date(Number(now) - 1001);

  const r0: HighScoresRow = {
    ...template,
    timeStamp,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    timeStamp,
    user: 2,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    timeStamp,
    user: 3,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [candidate]);
  t.is(table.dirty, true);
  t.is(position, 0);
});

test("remove lower results", (t) => {
  // Arrange.

  const r0: HighScoresRow = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    user: 1,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    user: 1,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [candidate]);
  t.is(table.dirty, true);
  t.is(position, 0);
});

test("insert if result is high", (t) => {
  // Arrange.

  const r0: HighScoresRow = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [candidate, r0, r1, r2]);
  t.is(table.dirty, true);
  t.is(position, 0);
});

test("insert if table is not full", (t) => {
  // Arrange.

  const r0: HighScoresRow = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [r0, r1, r2, candidate]);
  t.is(table.dirty, true);
  t.is(position, 3);
});

test("truncate to limit", (t) => {
  // Arrange.

  const r0: HighScoresRow = {
    ...template,
    user: 1,
    speed: 300,
    score: 300,
  };
  const r1: HighScoresRow = {
    ...template,
    user: 2,
    speed: 200,
    score: 200,
  };
  const r2: HighScoresRow = {
    ...template,
    user: 3,
    speed: 100,
    score: 100,
  };
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

  t.deepEqual([...table], [candidate]);
  t.is(table.dirty, true);
  t.is(position, 0);
});
