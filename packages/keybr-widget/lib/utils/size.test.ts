import { test } from "node:test";
import { assert } from "chai";
import { Size } from "./size.ts";

test("size", () => {
  assert.deepStrictEqual(
    { ...new Size(1, 2) },
    {
      width: 1,
      height: 2,
    },
  );

  assert.deepStrictEqual(
    { ...new Size({ width: 1, height: 2 }) },
    {
      width: 1,
      height: 2,
    },
  );

  assert.isFalse(Size.isSize(true));
  assert.isTrue(Size.isSize({ width: 1, height: 2 }));
});
