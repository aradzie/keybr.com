import test from "ava";
import { fromCsv, toCsv, type Word } from "./words.ts";

test("csv", (t) => {
  const words: Word[] = [
    ["one", 3],
    ["two", 5],
  ];

  t.deepEqual(fromCsv(toCsv(words)), words);
});
