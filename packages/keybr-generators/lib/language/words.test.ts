import test from "ava";
import { fromCsv, normalizeCounts, toCsv, type Word } from "./words.ts";

test("csv", (t) => {
  const words: Word[] = [
    ["one", 3],
    ["two", 5],
  ];

  t.deepEqual(fromCsv(toCsv(words)), words);
});

test("normalize", (t) => {
  t.deepEqual(
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
