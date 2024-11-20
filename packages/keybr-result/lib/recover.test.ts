import { test } from "node:test";
import { Histogram } from "@keybr/textinput";
import { deepEqual, isFalse, isTrue } from "rich-assert";
import { ResultFaker } from "./fake.tsx";
import { recoverResults } from "./recover.ts";
import { Result } from "./result.ts";

test("recover results", () => {
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

  isFalse(r1.validate());
  isTrue(r1x.validate());
  isTrue(r2.validate());

  deepEqual(recoverResults([]), []);
  deepEqual(recoverResults([r1]), [r1x]);
  deepEqual(recoverResults([r2]), [r2]);
  deepEqual(recoverResults([r1, r2]), [r1x, r2]);
});

test("fail to recover results", () => {
  const faker = new ResultFaker();

  const r1 = faker.nextResult({ histogram: new Histogram([]) });
  const r2 = faker.nextResult({ length: 0, time: 0 });
  const r3 = faker.nextResult();

  isFalse(r1.validate());
  isFalse(r2.validate());
  isTrue(r3.validate());

  deepEqual(recoverResults([]), []);
  deepEqual(recoverResults([r1]), []);
  deepEqual(recoverResults([r2]), []);
  deepEqual(recoverResults([r1, r2, r3]), [r3]);
});
