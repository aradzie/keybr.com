import test from "ava";
import { Letter } from "./letter.ts";

const a = new Letter(0x0061, 10);
const b = new Letter(0x0062, 30);
const c = new Letter(0x0063, 20);

test("toString", (t) => {
  t.is(String(a), "A");
  t.is(String(b), "B");
  t.is(String(c), "C");
});

test("normalize", (t) => {
  t.deepEqual(
    [...Letter.normalize([c, b, a]).map(({ f }) => f)],
    [0.3333333333333333, 0.5, 0.16666666666666666],
  );
});
