import test from "ava";
import { Ngram1, Ngram2 } from "./ngram.ts";

test("ngram1", (t) => {
  const ngram = new Ngram1([0x0061, 0x0062]);

  t.deepEqual(
    [...ngram],
    [
      { a: 0x0061, f: 0 },
      { a: 0x0062, f: 0 },
    ],
  );

  ngram.add(0x0061, 1);

  t.deepEqual(
    [...ngram],
    [
      { a: 0x0061, f: 1 },
      { a: 0x0062, f: 0 },
    ],
  );
});

test("ngram2", (t) => {
  const ngram = new Ngram2([0x0061, 0x0062]);

  t.deepEqual(
    [...ngram],
    [
      { a: 0x0061, b: 0x0061, f: 0 },
      { a: 0x0061, b: 0x0062, f: 0 },
      { a: 0x0062, b: 0x0061, f: 0 },
      { a: 0x0062, b: 0x0062, f: 0 },
    ],
  );

  ngram.add(0x0061, 0x0061, 1);

  t.deepEqual(
    [...ngram],
    [
      { a: 0x0061, b: 0x0061, f: 1 },
      { a: 0x0061, b: 0x0062, f: 0 },
      { a: 0x0062, b: 0x0061, f: 0 },
      { a: 0x0062, b: 0x0062, f: 0 },
    ],
  );
});
