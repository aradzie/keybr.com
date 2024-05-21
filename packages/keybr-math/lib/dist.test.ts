import test from "ava";
import { Distribution } from "./dist.ts";

test("distribution", (t) => {
  const dist = new Distribution([0, 10, 20, 30, 40]);

  t.is(dist.pmf(-1), 0.0);
  t.is(dist.pmf(0), 0.0);
  t.is(dist.pmf(1), 0.1);
  t.is(dist.pmf(2), 0.2);
  t.is(dist.pmf(3), 0.3);
  t.is(dist.pmf(4), 0.4);
  t.is(dist.pmf(5), 0.0);
  t.is(dist.pmf(1.1), 0.1);
  t.is(dist.pmf(1.9), 0.2);

  t.is(dist.cdf(-1), 0.0);
  t.is(dist.cdf(0), 0.0);
  t.is(dist.cdf(1), 0.1);
  t.is(dist.cdf(2), 0.30000000000000004);
  t.is(dist.cdf(3), 0.6000000000000001);
  t.is(dist.cdf(4), 1.0);
  t.is(dist.cdf(5), 1.0);
  t.is(dist.cdf(1.1), 0.1);
  t.is(dist.cdf(1.9), 0.30000000000000004);
});
