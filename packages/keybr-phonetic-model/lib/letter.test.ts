import test from "ava";
import { Letter } from "./letter.ts";

test("toString", (t) => {
  t.is(String(new Letter(0x0061, 10)), "a");
  t.is(String(new Letter(0x0061, 10, "A")), "A");
});

test("normalize", (t) => {
  t.deepEqual(
    Letter.normalize([
      new Letter(0x0063, 20, "C"),
      new Letter(0x0062, 30, "B"),
      new Letter(0x0061, 10, "A"),
    ]),
    [
      new Letter(0x0063, 0.3333333333333333, "C"),
      new Letter(0x0062, 0.5, "B"),
      new Letter(0x0061, 0.16666666666666666, "A"),
    ],
  );
});
