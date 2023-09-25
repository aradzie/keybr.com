import test from "ava";
import { splitText } from "./splittext.ts";

test("split empty content", (t) => {
  t.deepEqual(splitText(""), []);
  t.deepEqual(splitText(" \t \r \n "), []);
});

test("split single word", (t) => {
  t.deepEqual(splitText("a"), ["a"]);
});

test("split with length limit", (t) => {
  t.deepEqual(splitText("abc", 1), ["a", "b", "c"]);
});

test("split example text", (t) => {
  t.deepEqual(splitText(" Hello, \r World! \n "), ["Hello,", "World!"]);
});
