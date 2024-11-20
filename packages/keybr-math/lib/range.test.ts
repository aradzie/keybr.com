import { test } from "node:test";
import {
  doesNotThrow,
  equal,
  isFalse,
  isNaN,
  isTrue,
  throws,
} from "rich-assert";
import { Range } from "./range.ts";

test("construct", () => {
  isNaN(new Range().min);
  isNaN(new Range().max);

  equal(new Range(-1, +1).min, -1);
  equal(new Range(-1, +1).max, +1);

  equal(new Range(new Range(-1, +1)).min, -1);
  equal(new Range(new Range(-1, +1)).max, +1);
});

test("defined", () => {
  const range = new Range();

  isFalse(range.defined);
  throws(() => range.span, RangeError);
  throws(() => range.round(1), RangeError);

  range.min = 0;

  isFalse(range.defined);
  throws(() => range.span, RangeError);
  throws(() => range.round(1), RangeError);

  range.max = 0;

  isTrue(range.defined);
  doesNotThrow(() => range.span);
  doesNotThrow(() => range.round(1));
});

test("adjust", () => {
  const range = new Range();

  range.min = 0;
  range.max = 0;

  equal(range.min, 0);
  equal(range.max, 0);

  range.min = -1;
  range.max = +1;
  range.min = 0;
  range.max = 0;

  equal(range.min, -1);
  equal(range.max, +1);

  range.adjust([-1, +2, -2, +1]);

  equal(range.min, -2);
  equal(range.max, +2);
});

test("round", () => {
  const range = new Range();

  range.max = 3;
  range.min = 3;

  range.round(1);

  equal(range.max, 3);
  equal(range.min, 3);

  range.round(5);

  equal(range.max, 5);
  equal(range.min, 0);
});
