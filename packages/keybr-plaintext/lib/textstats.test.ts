import test from "ava";
import { textStatsOf } from "./textstats.ts";

test("empty text", (t) => {
  t.deepEqual(textStatsOf(""), {
    numWhitespace: 0,
    numCharacters: 0,
    numWords: 0,
    numUniqueWords: 0,
    avgWordLength: 0,
    wordCount: [],
  });
});

test("whitespace only", (t) => {
  t.deepEqual(textStatsOf(" \t\n\r\u2000\u2001\u2002\u2003\u2028\u2029"), {
    numWhitespace: 10,
    numCharacters: 0,
    numWords: 0,
    numUniqueWords: 0,
    avgWordLength: 0,
    wordCount: [],
  });
});

test("text with punctuation", (t) => {
  t.deepEqual(textStatsOf("\nOne, Two,\n'one'? \"two\"!\n"), {
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

test("joined words", (t) => {
  t.deepEqual(textStatsOf(" one's two's one-two one' 'two one- -two "), {
    numWhitespace: 8,
    numCharacters: 33,
    numWords: 7,
    numUniqueWords: 5,
    avgWordLength: 4.142857142857143,
    wordCount: [
      { word: "one", count: 2 },
      { word: "two", count: 2 },
      { word: "one-two", count: 1 },
      { word: "one's", count: 1 },
      { word: "two's", count: 1 },
    ],
  });
});

test("combining characters", (t) => {
  t.deepEqual(textStatsOf("text e\u0301xample\u0300"), {
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
