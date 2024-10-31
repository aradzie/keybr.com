import { test } from "node:test";
import { assert } from "chai";
import { Range } from "./range.ts";

test("construct", () => {
  assert.isNaN(new Range().min);
  assert.isNaN(new Range().max);

  assert.strictEqual(new Range(-1, +1).min, -1);
  assert.strictEqual(new Range(-1, +1).max, +1);

  assert.strictEqual(new Range(new Range(-1, +1)).min, -1);
  assert.strictEqual(new Range(new Range(-1, +1)).max, +1);
});

test("defined", () => {
  const range = new Range();

  assert.isFalse(range.defined);
  assert.throws(() => range.span, RangeError);
  assert.throws(() => range.round(1), RangeError);

  range.min = 0;

  assert.isFalse(range.defined);
  assert.throws(() => range.span, RangeError);
  assert.throws(() => range.round(1), RangeError);

  range.max = 0;

  assert.isTrue(range.defined);
  assert.doesNotThrow(() => range.span);
  assert.doesNotThrow(() => range.round(1));
});

test("adjust", () => {
  const range = new Range();

  range.min = 0;
  range.max = 0;

  assert.strictEqual(range.min, 0);
  assert.strictEqual(range.max, 0);

  range.min = -1;
  range.max = +1;
  range.min = 0;
  range.max = 0;

  assert.strictEqual(range.min, -1);
  assert.strictEqual(range.max, +1);

  range.adjust([-1, +2, -2, +1]);

  assert.strictEqual(range.min, -2);
  assert.strictEqual(range.max, +2);
});

test("round", () => {
  const range = new Range();

  range.max = 3;
  range.min = 3;

  range.round(1);

  assert.strictEqual(range.max, 3);
  assert.strictEqual(range.min, 3);

  range.round(5);

  assert.strictEqual(range.max, 5);
  assert.strictEqual(range.min, 0);
});
