import { test } from "node:test";
import { assert } from "chai";
import { textStatsOf } from "./textstats.ts";

test("empty text", () => {
  assert.deepStrictEqual(textStatsOf("en", ""), {
    numWhitespace: 0,
    numCharacters: 0,
    numWords: 0,
    numUniqueWords: 0,
    avgWordLength: 0,
    wordCount: [],
  });
});

test("whitespace only", () => {
  assert.deepStrictEqual(
    textStatsOf("en", " \t\n\r\u2000\u2001\u2002\u2003\u2028\u2029"),
    {
      numWhitespace: 10,
      numCharacters: 0,
      numWords: 0,
      numUniqueWords: 0,
      avgWordLength: 0,
      wordCount: [],
    },
  );
});

test("text with punctuation", () => {
  assert.deepStrictEqual(textStatsOf("en", "\nOne, Two,\n'one'? \"two\"!\n"), {
    numWhitespace: 5,
    numCharacters: 20,
    numWords: 4,
    numUniqueWords: 2,
    avgWordLength: 3,
    wordCount: [
      { word: "one", count: 2 },
      { word: "two", count: 2 },
    ],
  });
});

test("combining characters", () => {
  assert.deepStrictEqual(textStatsOf("en", "text e\u0301xample\u0300"), {
    numWhitespace: 1,
    numCharacters: 11,
    numWords: 2,
    numUniqueWords: 2,
    avgWordLength: 5.5,
    wordCount: [
      { word: "éxamplè", count: 1 },
      { word: "text", count: 1 },
    ],
  });
});

test("arabic", () => {
  assert.deepStrictEqual(
    textStatsOf("ar", "تناول المزيد من التفاح والبرتقال."),
    {
      numWhitespace: 4,
      numCharacters: 29,
      numWords: 5,
      numUniqueWords: 5,
      avgWordLength: 5.6,
      wordCount: [
        { word: "التفاح", count: 1 },
        { word: "المزيد", count: 1 },
        { word: "تناول", count: 1 },
        { word: "من", count: 1 },
        { word: "والبرتقال", count: 1 },
      ],
    },
  );
});

test("greek", () => {
  assert.deepStrictEqual(
    textStatsOf("el", "Τρώτε Περισσότερα Μήλα Και Πορτοκάλια."),
    {
      numWhitespace: 4,
      numCharacters: 34,
      numWords: 5,
      numUniqueWords: 5,
      avgWordLength: 6.6,
      wordCount: [
        { word: "και", count: 1 },
        { word: "μήλα", count: 1 },
        { word: "περισσότερα", count: 1 },
        { word: "πορτοκάλια", count: 1 },
        { word: "τρώτε", count: 1 },
      ],
    },
  );
});

test("hebrew", () => {
  assert.deepStrictEqual(textStatsOf("he", "תאכל יותר תפוחים ותפוזים."), {
    numWhitespace: 3,
    numCharacters: 22,
    numWords: 4,
    numUniqueWords: 4,
    avgWordLength: 5.25,
    wordCount: [
      { word: "ותפוזים", count: 1 },
      { word: "יותר", count: 1 },
      { word: "תאכל", count: 1 },
      { word: "תפוחים", count: 1 },
    ],
  });
});

test("japanese", () => {
  assert.deepStrictEqual(
    textStatsOf("ja", "リンゴとオレンジをもっと食べましょう。"),
    {
      numWhitespace: 0,
      numCharacters: 19,
      numWords: 9,
      numUniqueWords: 9,
      avgWordLength: 2,
      wordCount: [
        { word: "オレンジ", count: 1 },
        { word: "しょう", count: 1 },
        { word: "と", count: 1 },
        { word: "べ", count: 1 },
        { word: "ま", count: 1 },
        { word: "もっと", count: 1 },
        { word: "リンゴ", count: 1 },
        { word: "を", count: 1 },
        { word: "食", count: 1 },
      ],
    },
  );
});
