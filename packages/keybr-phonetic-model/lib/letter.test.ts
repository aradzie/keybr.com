import { test } from "node:test";
import { deepEqual, equal } from "rich-assert";
import { Letter } from "./letter.ts";

test("toString", () => {
  equal(String(new Letter(0x0061, 10)), "a");
  equal(String(new Letter(0x0061, 10, "A")), "A");
});

test("normalize", () => {
  deepEqual(
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
