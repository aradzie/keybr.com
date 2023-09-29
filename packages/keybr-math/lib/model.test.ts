import test from "ava";
import { r2 } from "./model.ts";
import { Vector } from "./vector.ts";

test("r2", (t) => {
  const vx = new Vector([1, 2, 3, 4, 5]);
  const vy = new Vector([1, 2, 3, 4, 5]);
  t.is(r2(vx, vy, { eval: (x) => x }), 1);
  t.is(r2(vx, vy, { eval: (x) => x * 0.9 }), 0.9450000000000001);
  t.is(r2(vx, vy, { eval: (x) => (x - 3) * 1.1 + 3 }), 0.99);
  t.is(r2(vx, vy, { eval: (x) => 0 }), -4.5);
});
