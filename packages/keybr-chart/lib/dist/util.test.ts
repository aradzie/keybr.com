import test from "ava";
import { bucketize, smooth } from "./util.ts";

test("smooth", (t) => {
  t.deepEqual(smooth([], 1), []);
  t.deepEqual(smooth([1], 1), [1]);
  t.deepEqual(smooth([1, 2, 3], 1), [1, 2, 3]);
  t.deepEqual(smooth([1, 4, 1, 4, 1], 1), [1, 2, 3, 2, 1]);
  t.deepEqual(smooth([1, 4, 1, 4, 1], 2), [1, 4, 2.2, 4, 1]);
});

test("bucketize", (t) => {
  t.deepEqual(bucketize([0, 10, 20, 30, 40], 5), [0, 10, 20, 30, 40]);
  t.deepEqual(bucketize([0, 10, 20, 30, 40], 4), [0, 10, 20, 35, 35]);
  t.deepEqual(bucketize([0, 10, 20, 30, 40], 3), [0, 15, 15, 35, 35]);
  t.deepEqual(bucketize([0, 10, 20, 30, 40], 2), [5, 5, 30, 30, 30]);
  t.deepEqual(bucketize([0, 10, 20, 30, 40], 1), [20, 20, 20, 20, 20]);
});
