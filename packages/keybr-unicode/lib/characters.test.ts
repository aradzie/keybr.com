import test from "ava";
import {
  isHighSurrogate,
  isLowSurrogate,
  isSurrogate,
  isSurrogatePair,
  toCodePoint,
  toHighSurrogate,
  toLowSurrogate,
} from "./characters.ts";

test("characters", (t) => {
  const s = "🍬";
  const codePoint = s.codePointAt(0)!;
  const highSurrogate = s.charCodeAt(0);
  const lowSurrogate = s.charCodeAt(1);

  t.false(isSurrogate(1));
  t.false(isHighSurrogate(1));
  t.false(isLowSurrogate(1));
  t.false(isSurrogatePair(1, 1));

  t.true(isSurrogate(highSurrogate));
  t.true(isHighSurrogate(highSurrogate));
  t.false(isLowSurrogate(highSurrogate));

  t.true(isSurrogate(lowSurrogate));
  t.true(isLowSurrogate(lowSurrogate));
  t.false(isHighSurrogate(lowSurrogate));

  t.true(isSurrogatePair(highSurrogate, lowSurrogate));
  t.false(isSurrogatePair(lowSurrogate, highSurrogate));

  t.is(toCodePoint(highSurrogate, lowSurrogate), codePoint);
  t.is(toHighSurrogate(codePoint), highSurrogate);
  t.is(toLowSurrogate(codePoint), lowSurrogate);
});
