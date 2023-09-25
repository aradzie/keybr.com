import test from "ava";
import { Point } from "./point.ts";

test("point", (t) => {
  t.deepEqual(
    { ...new Point(1, 2) },
    {
      x: 1,
      y: 2,
    },
  );

  t.deepEqual(
    { ...new Point({ x: 1, y: 2 }) },
    {
      x: 1,
      y: 2,
    },
  );

  t.false(Point.isPoint(true));
  t.true(Point.isPoint({ x: 1, y: 2 }));
});
