import test from "ava";
import { resample } from "./util.ts";

test("resample", (t) => {
  t.deepEqual(resample([1, 2], 4), [1, 1, 2, 2]);
  t.deepEqual(resample([1, 1, 2, 2], 2), [1, 2]);
});
