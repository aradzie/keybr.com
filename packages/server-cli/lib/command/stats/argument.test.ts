import test from "ava";
import { parseUserIdRange } from "./argument.ts";

test("parse user id range", (t) => {
  t.deepEqual([...parseUserIdRange("1")], [1]);
  t.deepEqual([...parseUserIdRange("1-3")], [1, 2, 3]);
  t.deepEqual([...parseUserIdRange("1,2,3")], [1, 2, 3]);
  t.deepEqual([...parseUserIdRange("1-2,2-3")], [1, 2, 3]);
  t.throws(() => {
    parseUserIdRange("-1");
  });
  t.throws(() => {
    parseUserIdRange("a");
  });
  t.throws(() => {
    parseUserIdRange(String(0xffffffff + 1));
  });
  t.throws(() => {
    parseUserIdRange("2-1");
  });
});
