import { test } from "node:test";
import { assert } from "chai";
import { Rect } from "./rect.ts";

test("rect", () => {
  assert.deepStrictEqual(
    { ...new Rect(1, 2, 3, 4) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  assert.deepStrictEqual(
    { ...new Rect({ x: 1, y: 2 }, { width: 3, height: 4 }) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  assert.deepStrictEqual(
    { ...new Rect({ x: 1, y: 2, width: 3, height: 4 }) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  assert.isFalse(Rect.isRect(true));
  assert.isTrue(Rect.isRect({ x: 1, y: 2, width: 3, height: 4 }));
});
