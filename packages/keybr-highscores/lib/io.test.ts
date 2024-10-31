import { test } from "node:test";
import { Layout } from "@keybr/keyboard";
import { assert } from "chai";
import { HighScores, type HighScoresRow } from "./highscores.ts";
import { reviver } from "./io.ts";

test("stringify and parse", () => {
  const row: HighScoresRow = {
    user: 123,
    layout: Layout.EN_US,
    timeStamp: new Date("2001-02-03T04:05:06Z"),
    time: 20000,
    length: 100,
    errors: 9,
    complexity: 26,
    speed: 100,
    score: 10000,
  };
  const a = new HighScores([row]);
  const b = new HighScores(JSON.parse(JSON.stringify(a), reviver));
  assert.deepStrictEqual([...a], [row]);
  assert.deepStrictEqual([...b], [row]);
});
