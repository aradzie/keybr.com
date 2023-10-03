import test from "ava";
import { Target } from "./target.ts";

test("confidence", (t) => {
  const target = new Target({ targetSpeed: /* 50WPM */ 250 });
  t.throws(() => target.confidence(NaN));
  t.throws(() => target.confidence(0));
  t.is(target.confidence(1000 / (500 / 60)), 2.0);
  t.is(target.confidence(1000 / (250 / 60)), 1.0);
  t.is(target.confidence(1000 / (125 / 60)), 0.5);
});
