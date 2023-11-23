import { Histogram } from "@keybr/textinput";
import test from "ava";
import { ResultFaker } from "./fake.tsx";
import { recoverResults } from "./recover.ts";
import { Result } from "./result.ts";

test("recover results", (t) => {
  const faker = new ResultFaker();

  const r1 = faker.nextResult({
    histogram: new Histogram([
      { codePoint: 0x0061, hitCount: 11, missCount: 1, timeToType: 111 },
      { codePoint: 0x0062, hitCount: 22, missCount: 2, timeToType: 222 },
      { codePoint: 0x0063, hitCount: 33, missCount: 3, timeToType: 333 },
      { codePoint: 0x0078, hitCount: 11, missCount: 1, timeToType: 1 }, // Invalid sample.
    ]),
  });
  const r1x = new Result(
    r1.layout,
    r1.textType,
    r1.timeStamp,
    r1.length,
    r1.time,
    r1.errors,
    new Histogram([
      { codePoint: 0x0061, hitCount: 11, missCount: 1, timeToType: 111 },
      { codePoint: 0x0062, hitCount: 22, missCount: 2, timeToType: 222 },
      { codePoint: 0x0063, hitCount: 33, missCount: 3, timeToType: 333 },
    ]),
  );
  const r2 = faker.nextResult();

  t.false(r1.validate());
  t.true(r1x.validate());
  t.true(r2.validate());

  t.deepEqual(recoverResults([]), []);
  t.deepEqual(recoverResults([r1]), [r1x]);
  t.deepEqual(recoverResults([r2]), [r2]);
  t.deepEqual(recoverResults([r1, r2]), [r1x, r2]);
});

test("fail to recover results", (t) => {
  const faker = new ResultFaker();

  const r1 = faker.nextResult({ histogram: new Histogram([]) });
  const r2 = faker.nextResult({ length: 0, time: 0 });
  const r3 = faker.nextResult();

  t.false(r1.validate());
  t.false(r2.validate());
  t.true(r3.validate());

  t.deepEqual(recoverResults([]), []);
  t.deepEqual(recoverResults([r1]), []);
  t.deepEqual(recoverResults([r2]), []);
  t.deepEqual(recoverResults([r1, r2, r3]), [r3]);
});
