import test from "ava";
import { Size } from "./size.ts";

test("size", (t) => {
  t.deepEqual(
    { ...new Size(1, 2) },
    {
      width: 1,
      height: 2,
    },
  );

  t.deepEqual(
    { ...new Size({ width: 1, height: 2 }) },
    {
      width: 1,
      height: 2,
    },
  );

  t.false(Size.isSize(true));
  t.true(Size.isSize({ width: 1, height: 2 }));
});
