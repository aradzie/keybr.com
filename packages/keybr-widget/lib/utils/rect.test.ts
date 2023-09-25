import test from "ava";
import { Rect } from "./rect.ts";

test("rect", (t) => {
  t.deepEqual(
    { ...new Rect(1, 2, 3, 4) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  t.deepEqual(
    { ...new Rect({ x: 1, y: 2 }, { width: 3, height: 4 }) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  t.deepEqual(
    { ...new Rect({ x: 1, y: 2, width: 3, height: 4 }) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  t.false(Rect.isRect(true));
  t.true(Rect.isRect({ x: 1, y: 2, width: 3, height: 4 }));
});
