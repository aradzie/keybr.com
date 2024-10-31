import { test } from "node:test";
import { assert } from "chai";
import { Language } from "./language.ts";

test("string manipulation", () => {
  assert.strictEqual(Language.TR.upperCase(""), "");
  assert.strictEqual(Language.TR.upperCase("AaIıİi"), "AAIIİİ");
  assert.strictEqual(Language.TR.lowerCase(""), "");
  assert.strictEqual(Language.TR.lowerCase("AaIıİi"), "aaııii");
  assert.strictEqual(Language.TR.capitalCase(""), "");
  assert.strictEqual(Language.TR.capitalCase("aaIıİi"), "Aaııii");
});

test("check words", () => {
  assert.isTrue(Language.EN.test(""));
  assert.isTrue(Language.EN.test("ABCdef"));
  assert.isFalse(Language.EN.test("AaIıİi"));
  assert.isFalse(Language.EN.test("абвгде"));
});

test("letter name", () => {
  assert.strictEqual(Language.EN.letterName(0x0069), "I");
  assert.strictEqual(Language.TR.letterName(0x0069), "İ");
  assert.strictEqual(Language.DE.letterName(0x00df), "ẞ");
  assert.strictEqual(Language.HE.letterName(0x05d0), "\u05D0");
  assert.strictEqual(Language.AR.letterName(0x0627), "\u200c\u0627");
  assert.strictEqual(Language.FA.letterName(0x0627), "\u200c\u0627");
});
