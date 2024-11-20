import { test } from "node:test";
import { deepEqual, isFalse, isTrue } from "rich-assert";
import { Size } from "./size.ts";

test("size", () => {
  deepEqual(
    { ...new Size(1, 2) },
    {
      width: 1,
      height: 2,
    },
  );

  deepEqual(
    { ...new Size({ width: 1, height: 2 }) },
    {
      width: 1,
      height: 2,
    },
  );

  isFalse(Size.isSize(true));
  isTrue(Size.isSize({ width: 1, height: 2 }));
});
