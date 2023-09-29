import test from "ava";
import { Range } from "./range.ts";

test("construct", (t) => {
  t.is(new Range().min, NaN);
  t.is(new Range().max, NaN);

  t.is(new Range(-1, +1).min, -1);
  t.is(new Range(-1, +1).max, +1);

  t.is(new Range(new Range(-1, +1)).min, -1);
  t.is(new Range(new Range(-1, +1)).max, +1);
});

test("defined", (t) => {
  const range = new Range();

  t.false(range.defined);
  t.throws(() => range.span, { instanceOf: RangeError });
  t.throws(() => range.round(1), { instanceOf: RangeError });

  range.min = 0;

  t.false(range.defined);
  t.throws(() => range.span, { instanceOf: RangeError });
  t.throws(() => range.round(1), { instanceOf: RangeError });

  range.max = 0;

  t.true(range.defined);
  t.notThrows(() => range.span);
  t.notThrows(() => range.round(1));
});

test("adjust", (t) => {
  const range = new Range();

  range.min = 0;
  range.max = 0;

  t.is(range.min, 0);
  t.is(range.max, 0);

  range.min = -1;
  range.max = +1;
  range.min = 0;
  range.max = 0;

  t.is(range.min, -1);
  t.is(range.max, +1);

  range.adjust([-1, +2, -2, +1]);

  t.is(range.min, -2);
  t.is(range.max, +2);
});

test("round", (t) => {
  const range = new Range();

  range.max = 3;
  range.min = 3;

  range.round(1);

  t.is(range.max, 3);
  t.is(range.min, 3);

  range.round(5);

  t.is(range.max, 5);
  t.is(range.min, 0);
});
