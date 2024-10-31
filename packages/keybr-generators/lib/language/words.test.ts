import { test } from "node:test";
import { assert } from "chai";
import { fromCsv, normalizeCounts, toCsv, type Word } from "./words.ts";

test("csv", () => {
  const words: Word[] = [
    ["one", 3],
    ["two", 5],
  ];

  assert.deepStrictEqual(fromCsv(toCsv(words)), words);
});

test("normalize", () => {
  assert.deepStrictEqual(
    normalizeCounts([
      ["a", 123],
      ["b", 10],
      ["c", 10],
    ]),
    [
      ["a", 12.3],
      ["b", 1],
      ["c", 1],
    ],
  );
});
