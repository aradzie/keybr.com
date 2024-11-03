import { test } from "node:test";
import { Filter, Letter } from "@keybr/phonetic-model";
import { toCodePoints } from "@keybr/unicode";
import { assert } from "chai";
import { Dictionary } from "./dictionary.ts";

test("empty dictionary", () => {
  const dict = new Dictionary([]);

  assert.deepStrictEqual([...dict], []);
  assert.deepStrictEqual(dict.find(new Filter()), []);
  assert.deepStrictEqual(dict.find(new Filter(toLetters("abc"), null)), []);
});

test("find words", () => {
  const dict = new Dictionary(["abc", "def", "ghi"]);
  const letters = toLetters("abcdefghi");

  assert.deepStrictEqual(dict.find(new Filter()), ["abc", "def", "ghi"]);
  assert.deepStrictEqual(dict.find(new Filter(toLetters("xyz"), null)), []);
  assert.deepStrictEqual(dict.find(new Filter(toLetters("abc"), null)), [
    "abc",
  ]);
  assert.deepStrictEqual(dict.find(new Filter(toLetters("abcd"), null)), [
    "abc",
  ]);
  assert.deepStrictEqual(dict.find(new Filter(toLetters("defg"), null)), [
    "def",
  ]);
  assert.deepStrictEqual(dict.find(new Filter(letters, null)), [
    "abc",
    "def",
    "ghi",
  ]);
  assert.deepStrictEqual(dict.find(new Filter(letters, letters[0])), ["abc"]);
  assert.deepStrictEqual(dict.find(new Filter(letters, letters[3])), ["def"]);
});

function toLetters(letters: string) {
  return [...toCodePoints(letters)].map(
    (codePoint) => new Letter(codePoint, 1),
  );
}
