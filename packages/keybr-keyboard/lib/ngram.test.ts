import test from "ava";
import { Ngram1, Ngram2 } from "./ngram.ts";

test("ngram1", (t) => {
  const ngram = new Ngram1([0x0061, 0x0062]);

  t.deepEqual([...ngram], []);

  ngram.add(0x0061, 1);

  t.deepEqual([...ngram], [[0x0061, 1]]);

  ngram.add(0x0062, 1);
  ngram.add(0x0062, 2);

  t.deepEqual(
    [...ngram],
    [
      [0x0061, 1],
      [0x0062, 3],
    ],
  );
});

test("ngram2", (t) => {
  const ngram = new Ngram2([0x0061, 0x0062]);

  t.deepEqual([...ngram], []);

  ngram.add(0x0061, 0x0061, 1);

  t.deepEqual([...ngram], [[0x0061, 0x0061, 1]]);

  ngram.add(0x0061, 0x0062, 1);
  ngram.add(0x0061, 0x0062, 2);

  t.deepEqual(
    [...ngram],
    [
      [0x0061, 0x0061, 1],
      [0x0061, 0x0062, 3],
    ],
  );
});
