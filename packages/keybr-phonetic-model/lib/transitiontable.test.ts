import { test } from "node:test";
import { DataError } from "@keybr/binary";
import { assert } from "chai";
import { TransitionTable } from "./transitiontable.ts";

test("parse binary data", () => {
  const data = new Uint8Array([
    // Signature.
    0x6b, 0x65, 0x79, 0x62, 0x72, 0x2e, 0x63, 0x6f, 0x6d,
    // Order.
    0x02,
    // Alphabet size.
    0x03,
    // Alphabet.
    0x00, 0x20, 0x00, 0x61, 0x00, 0x62,
    // Frequencies, segment 0.
    0x02, 0x01, 0x7f, 0x02, 0x80,
    // Frequencies, segment 1.
    0x00,
    // Frequencies, segment 2.
    0x00,
  ]);

  const table = TransitionTable.load(data);

  assert.deepStrictEqual(table.compress(), data);

  assert.strictEqual(table.order, 2);
  assert.strictEqual(String.fromCodePoint(...table.alphabet), " ab");
  assert.strictEqual(table.size, 3);
  assert.deepStrictEqual(table.segment([0]), [
    { codePoint: 0x0061, frequency: 127 },
    { codePoint: 0x0062, frequency: 128 },
  ]);
  assert.deepStrictEqual(table.segment([0x0061]), []);
  assert.deepStrictEqual(table.segment([0x0062]), []);
});

test("validate binary data", () => {
  assert.throws(() => {
    TransitionTable.load(new Uint8Array(0));
  }, DataError);
  assert.throws(() => {
    TransitionTable.load(new Uint8Array(100));
  }, DataError);
  assert.throws(() => {
    TransitionTable.load(new Uint8Array([1, 2, 3]));
  }, DataError);
});
