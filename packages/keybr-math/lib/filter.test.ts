import { test } from "node:test";
import { assert } from "chai";
import { makeFilter } from "./filter.ts";

test("filter", () => {
  const filter = makeFilter(0.5);

  assert.strictEqual(filter.n, 0);

  assert.strictEqual(filter.add(1), 1);
  assert.strictEqual(filter.n, 1);

  assert.strictEqual(filter.add(1), 1);
  assert.strictEqual(filter.n, 2);

  assert.strictEqual(filter.add(1), 1);
  assert.strictEqual(filter.n, 3);

  assert.strictEqual(filter.add(5), 3);
  assert.strictEqual(filter.n, 4);

  assert.strictEqual(filter.add(5), 4);
  assert.strictEqual(filter.n, 5);

  assert.strictEqual(filter.add(5), 4.5);
  assert.strictEqual(filter.n, 6);
});
