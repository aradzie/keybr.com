import { test } from "node:test";
import { deepEqual, isFalse, isTrue } from "rich-assert";
import { Point } from "./point.ts";

test("point", () => {
  deepEqual(
    { ...new Point(1, 2) },
    {
      x: 1,
      y: 2,
    },
  );

  deepEqual(
    { ...new Point({ x: 1, y: 2 }) },
    {
      x: 1,
      y: 2,
    },
  );

  isFalse(Point.isPoint(true));
  isTrue(Point.isPoint({ x: 1, y: 2 }));
});
