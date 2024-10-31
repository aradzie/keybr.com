import { test } from "node:test";
import { assert } from "chai";
import { Ngram1, Ngram2 } from "./ngram.ts";

test("ngram1", () => {
  const ngram = new Ngram1([0x0061, 0x0062]);

  assert.deepStrictEqual([...ngram], []);

  ngram.add(0x0061, 1);

  assert.deepStrictEqual([...ngram], [[0x0061, 1]]);

  ngram.add(0x0062, 1);
  ngram.add(0x0062, 2);

  assert.deepStrictEqual(
    [...ngram],
    [
      [0x0061, 1],
      [0x0062, 3],
    ],
  );
});

test("ngram2", () => {
  const ngram = new Ngram2([0x0061, 0x0062]);

  assert.deepStrictEqual([...ngram], []);

  ngram.add(0x0061, 0x0061, 1);

  assert.deepStrictEqual([...ngram], [[0x0061, 0x0061, 1]]);

  ngram.add(0x0061, 0x0062, 1);
  ngram.add(0x0061, 0x0062, 2);

  assert.deepStrictEqual(
    [...ngram],
    [
      [0x0061, 0x0061, 1],
      [0x0061, 0x0062, 3],
    ],
  );
});
