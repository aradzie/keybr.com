import test from "ava";
import { newTextStatsBuilder } from "./textstats.ts";

test("empty", (t) => {
  const builder = newTextStatsBuilder();

  t.deepEqual(builder.build(), {
    numWhitespace: 0,
    numCharacters: 0,
    numWords: 0,
    numUniqueWords: 0,
    avgWordLength: 0,
    wordCount: [],
  });
});

test("whitespace only", (t) => {
  const builder = newTextStatsBuilder();

  builder.append(" \t\n\r\u2000\u2001\u2002\u2003\u2028\u2029");

  t.deepEqual(builder.build(), {
    numWhitespace: 10,
    numCharacters: 0,
    numWords: 0,
    numUniqueWords: 0,
    avgWordLength: 0,
    wordCount: [],
  });
});

test("clean text", (t) => {
  const builder = newTextStatsBuilder();

  t.deepEqual(builder.build(), {
    numWhitespace: 0,
    numCharacters: 0,
    numWords: 0,
    numUniqueWords: 0,
    avgWordLength: 0,
    wordCount: [],
  });

  builder.append("one");

  t.deepEqual(builder.build(), {
    numWhitespace: 0,
    numCharacters: 3,
    numWords: 1,
    numUniqueWords: 1,
    avgWordLength: 3,
    wordCount: [{ word: "one", count: 1 }],
  });

  builder.append("ONE");

  t.deepEqual(builder.build(), {
    numWhitespace: 0,
    numCharacters: 6,
    numWords: 2,
    numUniqueWords: 1,
    avgWordLength: 3,
    wordCount: [{ word: "one", count: 2 }],
  });

  builder.append("two");

  t.deepEqual(builder.build(), {
    numWhitespace: 0,
    numCharacters: 9,
    numWords: 3,
    numUniqueWords: 2,
    avgWordLength: 3,
    wordCount: [
      { word: "one", count: 2 },
      { word: "two", count: 1 },
    ],
  });

  builder.append("One Two Three\n");

  t.deepEqual(builder.build(), {
    numWhitespace: 3,
    numCharacters: 20,
    numWords: 6,
    numUniqueWords: 3,
    avgWordLength: 3.3333333333333335,
    wordCount: [
      { word: "one", count: 3 },
      { word: "two", count: 2 },
      { word: "three", count: 1 },
    ],
  });
});

test("text with punctuation", (t) => {
  const builder = newTextStatsBuilder();

  builder.append("\nOne, Two,\n'one'? \"two\"!\n");

  t.deepEqual(builder.build(), {
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
  const builder = newTextStatsBuilder();

  builder.append(" one's two's one-two one' 'two one- -two ");

  t.deepEqual(builder.build(), {
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

test("unicode", (t) => {
  const builder = newTextStatsBuilder();

  builder.append("text e\u0301xample\u0300");

  t.deepEqual(builder.build(), {
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
