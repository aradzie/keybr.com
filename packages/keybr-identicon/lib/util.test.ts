import { test } from "node:test";
import { equal } from "rich-assert";
import { initials } from "./util.ts";

test("compute initials", () => {
  equal(initials(""), "");
  equal(initials("a"), "A");
  equal(initials(" a "), "A");
  equal(initials("abc"), "A");
  equal(initials(" abc "), "A");
  equal(initials("  a  b  "), "AB");
  equal(initials("  a  b  c  d  "), "ABC");
});

test("compute initials with custom limit", () => {
  equal(initials(" a b c d ", 0), "");
  equal(initials(" a b c d ", 1), "A");
  equal(initials(" a b c d ", 2), "AB");
  equal(initials(" a b c d ", 3), "ABC");
  equal(initials(" a b c d ", 4), "ABCD");
  equal(initials(" a b c d ", 5), "ABCD");
});
