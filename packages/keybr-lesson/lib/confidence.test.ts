import test from "ava";
import { MAX_TIME, MIN_TIME, timeToConfidence } from "./confidence.ts";

test("compute confidence", (t) => {
  t.is(timeToConfidence(NaN), null);
  t.is(timeToConfidence(0), null);
  t.is(timeToConfidence(MIN_TIME - 1), 1);
  t.is(timeToConfidence(MIN_TIME), 1);
  t.is(timeToConfidence((MIN_TIME + MAX_TIME) / 2), 0.5);
  t.is(timeToConfidence(MAX_TIME), 0);
  t.is(timeToConfidence(MAX_TIME + 1), 0);
});
