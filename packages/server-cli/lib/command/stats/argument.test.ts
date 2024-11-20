import { test } from "node:test";
import { deepEqual, equal, throws } from "rich-assert";
import { parseSpeed, parseUserIdRange } from "./argument.ts";

test("parse user id range", () => {
  deepEqual([...parseUserIdRange("1")], [1]);
  deepEqual([...parseUserIdRange("1-3")], [1, 2, 3]);
  deepEqual([...parseUserIdRange("1,2,3")], [1, 2, 3]);
  deepEqual([...parseUserIdRange("1-2,2-3")], [1, 2, 3]);
  throws(() => {
    parseUserIdRange("-1");
  });
  throws(() => {
    parseUserIdRange("a");
  });
  throws(() => {
    parseUserIdRange(String(0xffffffff + 1));
  });
  throws(() => {
    parseUserIdRange("2-1");
  });
});

test("parse speed", () => {
  equal(parseSpeed("100"), 500);
  equal(parseSpeed("100wpm"), 500);
  equal(parseSpeed("100cpm"), 100);

  throws(() => {
    parseSpeed("-100");
    parseSpeed("+100");
    parseSpeed("100.0");
    parseSpeed("100xyz");
    parseSpeed("100.0xyz");
  });
});
