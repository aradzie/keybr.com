import test from "ava";
import { newScanner } from "./scanner.ts";

test("empty", (t) => {
  const scanner = newScanner("");

  t.is(scanner.text.length, 0);

  t.true(scanner.end);

  t.is(scanner.lookAhead(0), -1);
  t.is(scanner.lookAhead(1), -1);
  t.is(scanner.lookAhead(2), -1);

  t.true(scanner.end);

  t.is(scanner.next(), -1);
  t.is(scanner.next(), -1);
  t.is(scanner.next(), -1);
});

test("normalize", (t) => {
  const scanner = newScanner("\u0061\u0301");

  t.is(scanner.text.length, 1);

  t.false(scanner.end);

  t.is(scanner.lookAhead(0), 0x00e1);
  t.is(scanner.lookAhead(1), -1);

  t.false(scanner.end);

  t.is(scanner.next(), 0x00e1);
  t.is(scanner.next(), -1);

  t.true(scanner.end);
});

test("basic multilingual plane", (t) => {
  const scanner = newScanner("abc");

  t.is(scanner.text.length, 3);

  t.false(scanner.end);

  t.is(scanner.lookAhead(0), 0x0061);
  t.is(scanner.lookAhead(1), 0x0062);
  t.is(scanner.lookAhead(2), 0x0063);
  t.is(scanner.lookAhead(3), -1);

  t.false(scanner.end);

  t.is(scanner.next(), 0x0061);
  t.is(scanner.next(), 0x0062);
  t.is(scanner.next(), 0x0063);
  t.is(scanner.next(), -1);

  t.true(scanner.end);
});

test("supplemental plane", (t) => {
  const scanner = newScanner("🍬🍭");

  t.is(scanner.text.length, 4);

  t.is(scanner.text.codePointAt(0), 0x1f36c);
  t.is(scanner.text.codePointAt(2), 0x1f36d);

  t.false(scanner.end);

  t.is(scanner.lookAhead(0), 0x1f36c);
  t.is(scanner.lookAhead(1), 0x1f36d);
  t.is(scanner.lookAhead(2), -1);

  t.false(scanner.end);

  t.is(scanner.next(), 0x1f36c);
  t.is(scanner.next(), 0x1f36d);
  t.is(scanner.next(), -1);

  t.true(scanner.end);
});
