import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { resample } from "./util.ts";

test("resample", () => {
  deepEqual(resample([1, 2], 4), [1, 1, 2, 2]);
  deepEqual(resample([1, 1, 2, 2], 2), [1, 2]);
});
