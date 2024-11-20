import { test } from "node:test";
import { deepEqual, isFalse, isTrue } from "rich-assert";
import { Rect } from "./rect.ts";

test("rect", () => {
  deepEqual(
    { ...new Rect(1, 2, 3, 4) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  deepEqual(
    { ...new Rect({ x: 1, y: 2 }, { width: 3, height: 4 }) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  deepEqual(
    { ...new Rect({ x: 1, y: 2, width: 3, height: 4 }) },
    {
      x: 1,
      y: 2,
      width: 3,
      height: 4,
    },
  );

  isFalse(Rect.isRect(true));
  isTrue(Rect.isRect({ x: 1, y: 2, width: 3, height: 4 }));
});
