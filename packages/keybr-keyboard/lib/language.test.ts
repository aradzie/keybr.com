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
