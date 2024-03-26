import { DataDir } from "@keybr/config";
import { Layout } from "@keybr/keyboard";
import { ResultFaker } from "@keybr/result";
import { fake } from "@keybr/test-env-time";
import { removeDir } from "@sosimple/fsx";
import test from "ava";
import { HighScoresFactory } from "./factory.ts";
import { type HighScoresRow } from "./highscores.ts";

const testDataDir = process.env.DATA_DIR ?? "/tmp/keybr";

const now = new Date("2001-02-03T04:05:06Z");

test.beforeEach(async () => {
  await removeDir(testDataDir);
});

test.beforeEach(() => {
  fake.date.set(now);
});

test.afterEach(() => {
  fake.date.reset();
});

test.afterEach(async () => {
  await removeDir(testDataDir);
});

test.serial("append table", async (t) => {
  const faker = new ResultFaker();
  const timeStamp = now.getTime();
  const result1 = faker.nextResult({ layout: Layout.EN_US, timeStamp });
  const result2 = faker.nextResult({ layout: Layout.EN_DVORAK, timeStamp });
  const row1: HighScoresRow = {
    user: 1,
    layout: Layout.EN_US,
    timeStamp: new Date(result1.timeStamp),
    time: result1.time,
    length: result1.length,
    errors: result1.errors,
    complexity: result1.complexity,
    speed: result1.speed,
    score: result1.score,
  };
  const row2: HighScoresRow = {
    user: 2,
    layout: Layout.EN_DVORAK,
    timeStamp: new Date(result2.timeStamp),
    time: result2.time,
    length: result2.length,
    errors: result2.errors,
    complexity: result2.complexity,
    speed: result2.speed,
    score: result2.score,
  };

  const factory = new HighScoresFactory(new DataDir(testDataDir));

  // Initial state.

  t.deepEqual([...(await factory.load())], []);

  // Add result by user 1.

  await factory.append(1, [result1]);
  t.deepEqual([...(await factory.load())], [row1]);

  // Add result by user 2.

  await factory.append(2, [result2]);
  t.deepEqual([...(await factory.load())], [row2, row1]);
});
