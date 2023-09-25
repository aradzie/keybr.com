import test from "ava";
import { hashCode } from "./hash.ts";

test("hash code of string", (t) => {
  t.is(hashCode(""), 0x00000001);
  t.is(hashCode("hello"), 0x079df171);
  t.is(hashCode("what a terrible failure"), 0x06092247);
});
