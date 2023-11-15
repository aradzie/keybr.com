import { Filter, Letter } from "@keybr/phonetic-model";
import { toCodePoints } from "@keybr/unicode";
import test from "ava";
import { Dictionary } from "./dictionary.ts";

test("empty dictionary", (t) => {
  const dict = new Dictionary([]);

  t.deepEqual([...dict], []);
  t.deepEqual(dict.find(new Filter()), []);
  t.deepEqual(dict.find(new Filter(toLetters("abc"), null)), []);
});

test("find words", (t) => {
  const dict = new Dictionary(["abc", "def", "ghi"]);
  const letters = toLetters("abcdefghi");

  t.deepEqual(dict.find(new Filter()), ["abc", "def", "ghi"]);
  t.deepEqual(dict.find(new Filter(toLetters("xyz"), null)), []);
  t.deepEqual(dict.find(new Filter(toLetters("abc"), null)), ["abc"]);
  t.deepEqual(dict.find(new Filter(toLetters("abcd"), null)), ["abc"]);
  t.deepEqual(dict.find(new Filter(toLetters("defg"), null)), ["def"]);
  t.deepEqual(dict.find(new Filter(letters, null)), ["abc", "def", "ghi"]);
  t.deepEqual(dict.find(new Filter(letters, letters[0])), ["abc"]);
  t.deepEqual(dict.find(new Filter(letters, letters[3])), ["def"]);
});

function toLetters(letters: string): Letter[] {
  return [...toCodePoints(letters)].map(
    (codePoint) => new Letter(codePoint, 1),
  );
}
