import { test } from "node:test";
import { equal } from "rich-assert";
import { hashCode } from "./hash.ts";

test("hash code of string", () => {
  equal(hashCode(""), 0x00000001);
  equal(hashCode("hello"), 0x079df171);
  equal(hashCode("what a terrible failure"), 0x06092247);
});
