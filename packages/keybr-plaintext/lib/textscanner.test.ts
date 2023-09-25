import test from "ava";
import { newTextScanner } from "./textscanner.ts";

test("failure", (t) => {
  t.false(newTextScanner("abc").scanWhitespace());
  t.false(newTextScanner("123").scanWhitespace());
  t.false(newTextScanner("!+?").scanWhitespace());
  t.false(newTextScanner(" \t\n\r").scanNonWhitespace());
  t.false(newTextScanner(" \t\n\r").scanWord());
  t.false(newTextScanner("123").scanWord());
  t.false(newTextScanner("!+?").scanWord());
});

test("empty", (t) => {
  const scanner = newTextScanner("");
  t.true(scanner.end);
  t.false(scanner.scanWhitespace());
  t.false(scanner.scanNonWhitespace());
  t.false(scanner.scanWord());
  t.is(scanner.index, 0);
});

test("whitespace", (t) => {
  const scanner = newTextScanner(" \t\r\n");
  t.true(scanner.scanWhitespace());
  t.is(scanner.scannedLength, 4);
  t.is(scanner.scannedText, " \t\r\n");
  t.true(scanner.seenWhitespace);
  t.true(scanner.seenLinebreak);
  t.true(scanner.end);
  t.is(scanner.index, 4);
});

test("non-whitespace", (t) => {
  const scanner = newTextScanner("!+?");
  t.true(scanner.scanNonWhitespace());
  t.is(scanner.scannedLength, 3);
  t.is(scanner.scannedText, "!+?");
  t.false(scanner.seenWhitespace);
  t.false(scanner.seenLinebreak);
  t.true(scanner.end);
  t.is(scanner.index, 3);
});

test("word", (t) => {
  const scanner = newTextScanner("abc");
  t.true(scanner.scanWord());
  t.is(scanner.scannedLength, 3);
  t.is(scanner.scannedText, "abc");
  t.false(scanner.seenWhitespace);
  t.false(scanner.seenLinebreak);
  t.true(scanner.end);
  t.is(scanner.index, 3);
});

test("word with separator", (t) => {
  const scanner = newTextScanner("abc-xyz");
  t.true(scanner.scanWord());
  t.is(scanner.scannedLength, 7);
  t.is(scanner.scannedText, "abc-xyz");
  t.false(scanner.seenWhitespace);
  t.false(scanner.seenLinebreak);
  t.true(scanner.end);
  t.is(scanner.index, 7);
});

test("word with max length", (t) => {
  const scanner = newTextScanner("abc");
  t.true(scanner.scanWord(1));
  t.is(scanner.scannedLength, 1);
  t.is(scanner.scannedText, "a");
  t.false(scanner.seenWhitespace);
  t.false(scanner.seenLinebreak);
  t.is(scanner.index, 1);
  t.true(scanner.scanWord());
  t.is(scanner.scannedLength, 2);
  t.is(scanner.scannedText, "bc");
  t.false(scanner.seenWhitespace);
  t.false(scanner.seenLinebreak);
  t.true(scanner.end);
  t.is(scanner.index, 3);
});

test("mixed", (t) => {
  const scanner = newTextScanner(" abc!xyz ");
  t.true(scanner.scanWhitespace());
  t.true(scanner.scanWord());
  t.is(scanner.next(), "!".codePointAt(0)!);
  t.true(scanner.scanWord());
  t.true(scanner.scanWhitespace());
  t.true(scanner.end);
});

test("combining characters", (t) => {
  const scanner = newTextScanner("\u0061\u0301bc");
  t.is(scanner.text, "\u00e1bc");
  t.true(scanner.scanWord());
  t.is(scanner.scannedLength, 3);
  t.is(scanner.scannedText, "\u00e1bc");
  t.false(scanner.seenWhitespace);
  t.false(scanner.seenLinebreak);
  t.true(scanner.end);
  t.is(scanner.index, 3);
});
