import { test } from "node:test";
import { assert } from "chai";
import { Distribution } from "./dist.ts";

test("distribution", () => {
  const dist = new Distribution([0, 10, 20, 30, 40]);

  assert.strictEqual(dist.pmf(-1), 0.0);
  assert.strictEqual(dist.pmf(0), 0.0);
  assert.strictEqual(dist.pmf(1), 0.1);
  assert.strictEqual(dist.pmf(2), 0.2);
  assert.strictEqual(dist.pmf(3), 0.3);
  assert.strictEqual(dist.pmf(4), 0.4);
  assert.strictEqual(dist.pmf(5), 0.0);
  assert.strictEqual(dist.pmf(1.1), 0.1);
  assert.strictEqual(dist.pmf(1.9), 0.2);

  assert.strictEqual(dist.cdf(-1), 0.0);
  assert.strictEqual(dist.cdf(0), 0.0);
  assert.strictEqual(dist.cdf(1), 0.1);
  assert.strictEqual(dist.cdf(2), 0.30000000000000004);
  assert.strictEqual(dist.cdf(3), 0.6000000000000001);
  assert.strictEqual(dist.cdf(4), 1.0);
  assert.strictEqual(dist.cdf(5), 1.0);
  assert.strictEqual(dist.cdf(1.1), 0.1);
  assert.strictEqual(dist.cdf(1.9), 0.30000000000000004);

  assert.strictEqual(dist.scale(-1.0), 0);
  assert.strictEqual(dist.scale(0.0), 0);
  assert.strictEqual(dist.scale(0.5), 2);
  assert.strictEqual(dist.scale(1.0), 4);
  assert.strictEqual(dist.scale(2.0), 4);

  assert.strictEqual(dist.unscale(-1), 0.0);
  assert.strictEqual(dist.unscale(0), 0.0);
  assert.strictEqual(dist.unscale(2), 0.5);
  assert.strictEqual(dist.unscale(4), 1.0);
  assert.strictEqual(dist.unscale(5), 1.0);
});
