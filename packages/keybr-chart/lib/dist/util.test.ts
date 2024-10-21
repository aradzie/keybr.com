import { test } from "node:test";
import { assert } from "chai";
import { bucketize, smooth } from "./util.ts";

test("smooth", () => {
  assert.deepStrictEqual(smooth([], 1), []);
  assert.deepStrictEqual(smooth([1], 1), [1]);
  assert.deepStrictEqual(smooth([1, 2, 3], 1), [1.5, 2, 2.5]);
  assert.deepStrictEqual(smooth([1, 4, 1, 4, 1], 1), [2.5, 2, 3, 2, 2.5]);
  assert.deepStrictEqual(smooth([1, 4, 1, 4, 1], 2), [2, 2.5, 2.2, 2.5, 2]);
});

test("bucketize", () => {
  assert.deepStrictEqual(
    bucketize([0, 10, 20, 30, 40], 5), //
    [0, 10, 20, 30, 40],
  );
  assert.deepStrictEqual(
    bucketize([0, 10, 20, 30, 40], 4), //
    [0, 10, 20, 35, 35],
  );
  assert.deepStrictEqual(
    bucketize([0, 10, 20, 30, 40], 3), //
    [0, 15, 15, 35, 35],
  );
  assert.deepStrictEqual(
    bucketize([0, 10, 20, 30, 40], 2), //
    [5, 5, 30, 30, 30],
  );
  assert.deepStrictEqual(
    bucketize([0, 10, 20, 30, 40], 1), //
    [20, 20, 20, 20, 20],
  );
});
