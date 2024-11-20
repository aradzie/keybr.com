import { test } from "node:test";
import { deepEqual } from "rich-assert";
import { bucketize, smooth } from "./util.ts";

test("smooth", () => {
  deepEqual(smooth([], 1), []);
  deepEqual(smooth([1], 1), [1]);
  deepEqual(smooth([1, 2, 3], 1), [1.5, 2, 2.5]);
  deepEqual(smooth([1, 4, 1, 4, 1], 1), [2.5, 2, 3, 2, 2.5]);
  deepEqual(smooth([1, 4, 1, 4, 1], 2), [2, 2.5, 2.2, 2.5, 2]);
});

test("bucketize", () => {
  deepEqual(
    bucketize([0, 10, 20, 30, 40], 5), //
    [0, 10, 20, 30, 40],
  );
  deepEqual(
    bucketize([0, 10, 20, 30, 40], 4), //
    [0, 10, 20, 35, 35],
  );
  deepEqual(
    bucketize([0, 10, 20, 30, 40], 3), //
    [0, 15, 15, 35, 35],
  );
  deepEqual(
    bucketize([0, 10, 20, 30, 40], 2), //
    [5, 5, 30, 30, 30],
  );
  deepEqual(
    bucketize([0, 10, 20, 30, 40], 1), //
    [20, 20, 20, 20, 20],
  );
});
