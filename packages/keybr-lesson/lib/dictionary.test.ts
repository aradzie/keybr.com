import { test } from "node:test";
import { Filter, Letter } from "@keybr/phonetic-model";
import { toCodePoints } from "@keybr/unicode";
import { deepEqual } from "rich-assert";
import { Dictionary } from "./dictionary.ts";

test("empty dictionary", () => {
  const dict = new Dictionary([]);

  deepEqual([...dict], []);
  deepEqual(dict.find(new Filter()), []);
  deepEqual(dict.find(new Filter(toLetters("abc"), null)), []);
});

test("find words", () => {
  const dict = new Dictionary(["abc", "def", "ghi"]);
  const letters = toLetters("abcdefghi");

  deepEqual(dict.find(new Filter()), ["abc", "def", "ghi"]);
  deepEqual(dict.find(new Filter(toLetters("xyz"), null)), []);
  deepEqual(dict.find(new Filter(toLetters("abc"), null)), ["abc"]);
  deepEqual(dict.find(new Filter(toLetters("abcd"), null)), ["abc"]);
  deepEqual(dict.find(new Filter(toLetters("defg"), null)), ["def"]);
  deepEqual(dict.find(new Filter(letters, null)), ["abc", "def", "ghi"]);
  deepEqual(dict.find(new Filter(letters, letters[0])), ["abc"]);
  deepEqual(dict.find(new Filter(letters, letters[3])), ["def"]);
});

test("case insensitive filtering", () => {
  const dict = new Dictionary(["Hello", "WORLD", "Test", "test"]);
  const letters = toLetters("helloworldtest");

  deepEqual(dict.find(new Filter(letters, null)), [
    "Hello",
    "WORLD",
    "Test",
    "test",
  ]);
});

test("german uppercase words", () => {
  const dict = new Dictionary([
    "Hexe",
    "Mexiko",
    "Hobby",
    "Baby",
    "existieren",
  ]);
  const letters = toLetters("abcdefghimopxy");

  const result = dict.find(new Filter(letters, null));

  const hasX = result.some((w) => w.toLowerCase().includes("x"));
  deepEqual(hasX, true, "Should find words with x like Hexe, Mexiko");
});

test("german sharp s character", () => {
  const dict = new Dictionary(["Straße", "straße", "STRASSE"]);
  const letters = toLetters("abcdefghijklmnopqrstuvwxyzß");

  deepEqual(dict.find(new Filter(letters, null)), [
    "Straße",
    "straße",
    "STRASSE",
  ]);
});

function toLetters(letters: string) {
  return [...toCodePoints(letters)].map(
    (codePoint) => new Letter(codePoint, 1),
  );
}
