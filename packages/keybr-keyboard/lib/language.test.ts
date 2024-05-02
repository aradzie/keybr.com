import test from "ava";
import { Language } from "./language.ts";

test("string manipulation", (t) => {
  t.is(Language.TR.upperCase(""), "");
  t.is(Language.TR.upperCase("AaIıİi"), "AAIIİİ");
  t.is(Language.TR.lowerCase(""), "");
  t.is(Language.TR.lowerCase("AaIıİi"), "aaııii");
  t.is(Language.TR.capitalCase(""), "");
  t.is(Language.TR.capitalCase("aaIıİi"), "Aaııii");
});

test("check words", (t) => {
  t.true(Language.EN.test(""));
  t.true(Language.EN.test("ABCdef"));
  t.false(Language.EN.test("AaIıİi"));
  t.false(Language.EN.test("абвгде"));
});

test("letter name", (t) => {
  t.is(Language.EN.letterName(0x0069), "I");
  t.is(Language.TR.letterName(0x0069), "İ");
  t.is(Language.DE.letterName(0x00df), "ẞ");
  t.is(Language.HE.letterName(0x05d0), "\u05D0");
  t.is(Language.AR.letterName(0x0627), "\u200c\u0627");
  t.is(Language.FA.letterName(0x0627), "\u200c\u0627");
});
