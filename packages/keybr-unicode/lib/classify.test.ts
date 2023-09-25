import test from "ava";
import {
  isControl,
  isDigit,
  isLcLetter,
  isLetter,
  isLinebreak,
  isUcLetter,
  isWhitespace,
} from "./classify.ts";
import { toCodePoints } from "./codepoints.ts";

test("classify", (t) => {
  for (const codePoint of toCodePoints("\n\r\t")) {
    t.true(isControl(codePoint));
  }
  for (const codePoint of toCodePoints("\n\r\u2028\u2029")) {
    t.true(isLinebreak(codePoint));
  }
  for (const codePoint of toCodePoints(" \n\r\t\u2028\u2029")) {
    t.true(isWhitespace(codePoint));
  }
  for (const codePoint of toCodePoints("0123456789")) {
    t.true(isDigit(codePoint));
  }
  for (const codePoint of toCodePoints("abcdefghijklmnopqrstuvwxyz")) {
    t.true(isLetter(codePoint));
    t.true(isLcLetter(codePoint));
    t.false(isUcLetter(codePoint));
  }
  for (const codePoint of toCodePoints("ABCDEFGHIJKLMNOPQRSTUVWXYZ")) {
    t.true(isLetter(codePoint));
    t.true(isUcLetter(codePoint));
    t.false(isLcLetter(codePoint));
  }
  for (const codePoint of toCodePoints("ÀàÈèÌìǸǹÒòÙùẀẁỲỳ")) {
    t.true(isLetter(codePoint));
  }
  for (const codePoint of toCodePoints("ÁáĆćÉéǴǵÍíḰḱĹĺḾḿŃńÓóṔṕŔŕŚśÚúẂẃÝýŹź")) {
    t.true(isLetter(codePoint));
  }
  for (const codePoint of toCodePoints("ÇçḐḑȨȩĢģḨḩĶķĻļŅņŖŗŞşŢţ")) {
    t.true(isLetter(codePoint));
  }
  for (const codePoint of toCodePoints("абракадабра")) {
    t.true(isLetter(codePoint));
  }
});
