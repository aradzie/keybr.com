import { test } from "node:test";
import { DataDir } from "@keybr/config";
import { Layout } from "@keybr/keyboard";
import { ResultFaker } from "@keybr/result";
import { removeDir } from "@sosimple/fsx";
import { deepEqual } from "rich-assert";
import { HighScoresFactory } from "./factory.ts";
import { type HighScoresRow } from "./highscores.ts";

const tmp = process.env.DATA_DIR ?? "/tmp/keybr";

test.beforeEach(async () => {
  await removeDir(tmp);
});

test.afterEach(async () => {
  await removeDir(tmp);
});

test("append table", async (ctx) => {
  const now = new Date("2001-02-03T04:05:06Z");
  ctx.mock.timers.enable({ apis: ["Date"], now });
  const faker = new ResultFaker();
  const timeStamp = now.getTime();
  const result1 = faker.nextResult({ layout: Layout.EN_US, timeStamp });
  const result2 = faker.nextResult({ layout: Layout.EN_DVORAK, timeStamp });
  const row1 = {
    user: 1,
    layout: Layout.EN_US,
    timeStamp: new Date(result1.timeStamp),
    time: result1.time,
    length: result1.length,
    errors: result1.errors,
    complexity: result1.complexity,
    speed: result1.speed,
    score: result1.score,
  } satisfies HighScoresRow;
  const row2 = {
    user: 2,
    layout: Layout.EN_DVORAK,
    timeStamp: new Date(result2.timeStamp),
    time: result2.time,
    length: result2.length,
    errors: result2.errors,
    complexity: result2.complexity,
    speed: result2.speed,
    score: result2.score,
  } satisfies HighScoresRow;

  const factory = new HighScoresFactory(new DataDir(tmp));

  // Initial state.

  deepEqual([...(await factory.load())], []);

  // Add a result of user 1.

  await factory.append(1, [result1]);
  deepEqual([...(await factory.load())], [row1]);

  // Add a result of user 2.

  await factory.append(2, [result2]);
  deepEqual([...(await factory.load())], [row2, row1]);
});
