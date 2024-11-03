import { test } from "node:test";
import { assert } from "chai";
import { Point } from "./point.ts";

test("point", () => {
  assert.deepStrictEqual(
    { ...new Point(1, 2) },
    {
      x: 1,
      y: 2,
    },
  );

  assert.deepStrictEqual(
    { ...new Point({ x: 1, y: 2 }) },
    {
      x: 1,
      y: 2,
    },
  );

  assert.isFalse(Point.isPoint(true));
  assert.isTrue(Point.isPoint({ x: 1, y: 2 }));
});
