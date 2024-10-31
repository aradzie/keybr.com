import { describe, it } from "node:test";
import { assert } from "chai";
import { codePointLength, toCodePoints } from "./codepoints.ts";

describe("to code points", () => {
  it("should convert an empty string", () => {
    const s = "";
    assert.strictEqual(s.length, 0);
    assert.strictEqual(codePointLength(s), 0);
    assert.strictEqual(String.fromCodePoint(...toCodePoints(s)), s);
    assert.deepStrictEqual([...toCodePoints(s)], []);
  });

  it("should convert plain text", () => {
    const s = "abc";
    assert.strictEqual(s.length, 3);
    assert.strictEqual(codePointLength(s), 3);
    assert.strictEqual(String.fromCodePoint(...toCodePoints(s)), s);
    assert.deepStrictEqual([...toCodePoints(s)], [0x0061, 0x0062, 0x0063]);
  });

  it("should convert emoji", () => {
    const s = "🍬🍭";
    assert.strictEqual(s.length, 4);
    assert.strictEqual(codePointLength(s), 2);
    assert.strictEqual(String.fromCodePoint(...toCodePoints(s)), s);
    assert.deepStrictEqual([...toCodePoints(s)], [0x01_f36c, 0x01_f36d]);
  });
});
