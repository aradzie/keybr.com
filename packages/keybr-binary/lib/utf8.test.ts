import { test } from "node:test";
import { assert } from "chai";
import { DataError } from "./errors.ts";
import { decode, encode, encodedByteCount } from "./utf8.ts";

test("compute encoded byte count", () => {
  assert.strictEqual(encodedByteCount(""), 0);
  assert.strictEqual(encodedByteCount("hello"), 5);
  assert.strictEqual(encodedByteCount("привет"), 12);
  assert.strictEqual(encodedByteCount("\u0000\u000F\u00FF\u0FFF\uFFFF"), 10);
  assert.strictEqual(encodedByteCount("🍬🍭"), 8);
});

test("encode and decode selected examples", () => {
  const buffer = new DataView(new ArrayBuffer(1024));
  let byteCount: number;

  byteCount = encode("", buffer, 0);
  assert.strictEqual(byteCount, 0);
  assert.strictEqual(decode(buffer, 0, byteCount), "");

  byteCount = encode("hello", buffer, 0);
  assert.strictEqual(byteCount, 5);
  assert.strictEqual(decode(buffer, 0, byteCount), "hello");

  byteCount = encode("привет", buffer, 0);
  assert.strictEqual(byteCount, 12);
  assert.strictEqual(decode(buffer, 0, byteCount), "привет");

  byteCount = encode("\u0000\u000F\u00FF\u0FFF\uFFFF", buffer, 0);
  assert.strictEqual(byteCount, 10);
  assert.strictEqual(
    decode(buffer, 0, byteCount),
    "\u0000\u000F\u00FF\u0FFF\uFFFF",
  );

  byteCount = encode("🍬🍭", buffer, 0);
  assert.strictEqual(byteCount, 8);
  assert.strictEqual(decode(buffer, 0, byteCount), "🍬🍭");

  buffer.setUint8(0, 0b11110000);
  buffer.setUint8(1, 0b10000000);
  buffer.setUint8(2, 0b10000000);
  buffer.setUint8(3, 0b10000000);
  assert.strictEqual(decode(buffer, 0, 4), "\u{000000}");

  buffer.setUint8(0, 0b11110100);
  buffer.setUint8(1, 0b10001111);
  buffer.setUint8(2, 0b10111111);
  buffer.setUint8(3, 0b10111111);
  assert.strictEqual(decode(buffer, 0, 4), "\u{10FFFF}");
});

test("encode and decode the full code point range", () => {
  let value = "";
  for (let i = 0; i <= 0x10ffff; i++) {
    value += String.fromCodePoint(i);
  }
  const buffer = new DataView(new ArrayBuffer(encodedByteCount(value)));
  assert.strictEqual(decode(buffer, 0, encode(value, buffer, 0)), value);
});

test("decode surrogate pairs", () => {
  const buffer = new DataView(new ArrayBuffer(1024));
  let byteCount: number;

  byteCount = encode("\uD83C", buffer, 0);
  assert.strictEqual(byteCount, 3);
  assert.strictEqual(decode(buffer, 0, byteCount), "\uD83C");

  byteCount = encode("\uDF6C", buffer, 0);
  assert.strictEqual(byteCount, 3);
  assert.strictEqual(decode(buffer, 0, byteCount), "\uDF6C");

  buffer.setUint8(0, 0xed);
  buffer.setUint8(1, 0xa0);
  buffer.setUint8(2, 0xbc);
  buffer.setUint8(3, 0xed);
  buffer.setUint8(4, 0xbd);
  buffer.setUint8(5, 0xac);
  assert.strictEqual(decode(buffer, 0, 6), "🍬");
  assert.strictEqual(decode(buffer, 0, 3), "\uD83C");
  assert.strictEqual(decode(buffer, 3, 3), "\uDF6C");
});

test("report truncated stream", () => {
  const buffer = new DataView(new ArrayBuffer(1024));

  buffer.setUint8(0, 0b11110100);
  buffer.setUint8(1, 0b10001111);
  buffer.setUint8(2, 0b10111111);
  buffer.setUint8(3, 0b10111111);
  assert.throws(() => {
    decode(buffer, 0, 1);
  }, DataError);
  assert.throws(() => {
    decode(buffer, 0, 2);
  }, DataError);
  assert.throws(() => {
    decode(buffer, 0, 3);
  }, DataError);

  buffer.setUint8(0, 0b11101111);
  buffer.setUint8(1, 0b10111111);
  buffer.setUint8(2, 0b10111111);
  assert.throws(() => {
    decode(buffer, 0, 1);
  }, DataError);
  assert.throws(() => {
    decode(buffer, 0, 2);
  }, DataError);

  buffer.setUint8(0, 0b11011111);
  buffer.setUint8(1, 0b10111111);
  assert.throws(() => {
    decode(buffer, 0, 1);
  }, DataError);
});
