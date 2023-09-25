import test from "ava";
import { codePointLength, toCodePoints } from "./codepoints.ts";

test("code points", (t) => {
  {
    const s = "";
    t.is(s.length, 0);
    t.is(codePointLength(s), 0);
    t.is(String.fromCodePoint(...toCodePoints(s)), s);
    t.deepEqual([...toCodePoints(s)], []);
  }

  {
    const s = "abc";
    t.is(s.length, 3);
    t.is(codePointLength(s), 3);
    t.is(String.fromCodePoint(...toCodePoints(s)), s);
    t.deepEqual([...toCodePoints(s)], [0x0061, 0x0062, 0x0063]);
  }

  {
    const s = "🍬🍭";
    t.is(s.length, 4);
    t.is(codePointLength(s), 2);
    t.is(String.fromCodePoint(...toCodePoints(s)), s);
    t.deepEqual([...toCodePoints(s)], [0x01_f36c, 0x01_f36d]);
  }
});
