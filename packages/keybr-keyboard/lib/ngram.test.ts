import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { Ngram1, Ngram2 } from "./ngram.ts";

test("ngram1", () => {
  const ngram = new Ngram1([0x0061, 0x0062]);

  deepEqual([...ngram], []);

  ngram.add(0x0061, 1);

  deepEqual([...ngram], [[0x0061, 1]]);

  ngram.add(0x0062, 1);
  ngram.add(0x0062, 2);

  deepEqual(
    [...ngram],
    [
      [0x0061, 1],
      [0x0062, 3],
    ],
  );
});

test("ngram2", () => {
  const ngram = new Ngram2([0x0061, 0x0062]);

  deepEqual([...ngram], []);

  ngram.add(0x0061, 0x0061, 1);

  deepEqual([...ngram], [[0x0061, 0x0061, 1]]);

  ngram.add(0x0061, 0x0062, 1);
  ngram.add(0x0061, 0x0062, 2);

  deepEqual(
    [...ngram],
    [
      [0x0061, 0x0061, 1],
      [0x0061, 0x0062, 3],
    ],
  );
});
