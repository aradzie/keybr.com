import test from "ava";
import { initials } from "./util.ts";

test("compute initials", (t) => {
  t.is(initials(""), "");
  t.is(initials("a"), "A");
  t.is(initials(" a "), "A");
  t.is(initials("abc"), "A");
  t.is(initials(" abc "), "A");
  t.is(initials("  a  b  "), "AB");
  t.is(initials("  a  b  c  d  "), "ABC");
});

test("compute initials with custom limit", (t) => {
  t.is(initials(" a b c d ", 0), "");
  t.is(initials(" a b c d ", 1), "A");
  t.is(initials(" a b c d ", 2), "AB");
  t.is(initials(" a b c d ", 3), "ABC");
  t.is(initials(" a b c d ", 4), "ABCD");
  t.is(initials(" a b c d ", 5), "ABCD");
});
