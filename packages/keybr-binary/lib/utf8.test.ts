import test from "ava";
import { DataError } from "./errors.ts";
import { decode, encode, encodedByteCount } from "./utf8.ts";

test("compute encoded byte count", (t) => {
  t.is(encodedByteCount(""), 0);
  t.is(encodedByteCount("hello"), 5);
  t.is(encodedByteCount("привет"), 12);
  t.is(encodedByteCount("\u0000\u000F\u00FF\u0FFF\uFFFF"), 10);
  t.is(encodedByteCount("🍬🍭"), 8);
});

test("encode and decode selected examples", (t) => {
  const buffer = new DataView(new ArrayBuffer(1024));
  let byteCount: number;

  byteCount = encode("", buffer, 0);
  t.is(byteCount, 0);
  t.is(decode(buffer, 0, byteCount), "");

  byteCount = encode("hello", buffer, 0);
  t.is(byteCount, 5);
  t.is(decode(buffer, 0, byteCount), "hello");

  byteCount = encode("привет", buffer, 0);
  t.is(byteCount, 12);
  t.is(decode(buffer, 0, byteCount), "привет");

  byteCount = encode("\u0000\u000F\u00FF\u0FFF\uFFFF", buffer, 0);
  t.is(byteCount, 10);
  t.is(decode(buffer, 0, byteCount), "\u0000\u000F\u00FF\u0FFF\uFFFF");

  byteCount = encode("🍬🍭", buffer, 0);
  t.is(byteCount, 8);
  t.is(decode(buffer, 0, byteCount), "🍬🍭");

  buffer.setUint8(0, 0b11110000);
  buffer.setUint8(1, 0b10000000);
  buffer.setUint8(2, 0b10000000);
  buffer.setUint8(3, 0b10000000);
  t.is(decode(buffer, 0, 4), "\u{000000}");

  buffer.setUint8(0, 0b11110100);
  buffer.setUint8(1, 0b10001111);
  buffer.setUint8(2, 0b10111111);
  buffer.setUint8(3, 0b10111111);
  t.is(decode(buffer, 0, 4), "\u{10FFFF}");
});

test("encode and decode full code point range", (t) => {
  const buffer = new DataView(new ArrayBuffer(1024));

  for (let i = 0; i <= 0x10ffff; i++) {
    const value = String.fromCodePoint(i, i, i);
    const byteCount = encode(value, buffer, 0);
    t.deepEqual(decode(buffer, 0, byteCount), value);
  }
});

test("decode surrogate pairs", (t) => {
  const buffer = new DataView(new ArrayBuffer(1024));
  let byteCount: number;

  byteCount = encode("\uD83C", buffer, 0);
  t.is(byteCount, 3);
  t.is(decode(buffer, 0, byteCount), "\uD83C");

  byteCount = encode("\uDF6C", buffer, 0);
  t.is(byteCount, 3);
  t.is(decode(buffer, 0, byteCount), "\uDF6C");

  buffer.setUint8(0, 0xed);
  buffer.setUint8(1, 0xa0);
  buffer.setUint8(2, 0xbc);
  buffer.setUint8(3, 0xed);
  buffer.setUint8(4, 0xbd);
  buffer.setUint8(5, 0xac);
  t.is(decode(buffer, 0, 6), "🍬");
  t.is(decode(buffer, 0, 3), "\uD83C");
  t.is(decode(buffer, 3, 3), "\uDF6C");
});

test("report truncated stream", (t) => {
  const buffer = new DataView(new ArrayBuffer(1024));

  buffer.setUint8(0, 0b11110100);
  buffer.setUint8(1, 0b10001111);
  buffer.setUint8(2, 0b10111111);
  buffer.setUint8(3, 0b10111111);
  t.throws(
    () => {
      decode(buffer, 0, 1);
    },
    { instanceOf: DataError },
  );
  t.throws(
    () => {
      decode(buffer, 0, 2);
    },
    { instanceOf: DataError },
  );
  t.throws(
    () => {
      decode(buffer, 0, 3);
    },
    { instanceOf: DataError },
  );

  buffer.setUint8(0, 0b11101111);
  buffer.setUint8(1, 0b10111111);
  buffer.setUint8(2, 0b10111111);
  t.throws(
    () => {
      decode(buffer, 0, 1);
    },
    { instanceOf: DataError },
  );
  t.throws(
    () => {
      decode(buffer, 0, 2);
    },
    { instanceOf: DataError },
  );

  buffer.setUint8(0, 0b11011111);
  buffer.setUint8(1, 0b10111111);
  t.throws(
    () => {
      decode(buffer, 0, 1);
    },
    { instanceOf: DataError },
  );
});
