import { test } from "node:test";
import { equal } from "rich-assert";
import { Distribution } from "./dist.ts";

test("distribution", () => {
  const dist = new Distribution([0, 10, 20, 30, 40]);

  equal(dist.pmf(-1), 0.0);
  equal(dist.pmf(0), 0.0);
  equal(dist.pmf(1), 0.1);
  equal(dist.pmf(2), 0.2);
  equal(dist.pmf(3), 0.3);
  equal(dist.pmf(4), 0.4);
  equal(dist.pmf(5), 0.0);
  equal(dist.pmf(1.1), 0.1);
  equal(dist.pmf(1.9), 0.2);

  equal(dist.cdf(-1), 0.0);
  equal(dist.cdf(0), 0.0);
  equal(dist.cdf(1), 0.1);
  equal(dist.cdf(2), 0.30000000000000004);
  equal(dist.cdf(3), 0.6000000000000001);
  equal(dist.cdf(4), 1.0);
  equal(dist.cdf(5), 1.0);
  equal(dist.cdf(1.1), 0.1);
  equal(dist.cdf(1.9), 0.30000000000000004);

  equal(dist.scale(-1.0), 0);
  equal(dist.scale(0.0), 0);
  equal(dist.scale(0.5), 2);
  equal(dist.scale(1.0), 4);
  equal(dist.scale(2.0), 4);

  equal(dist.unscale(-1), 0.0);
  equal(dist.unscale(0), 0.0);
  equal(dist.unscale(2), 0.5);
  equal(dist.unscale(4), 1.0);
  equal(dist.unscale(5), 1.0);
});
