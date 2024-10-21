import { describe, it } from "node:test";
import { assert } from "chai";
import { asUint8Array } from "./util.ts";

describe("convert to Uint8Array", () => {
  const source = new ArrayBuffer(32);

  it("should convert from ArrayBuffer", () => {
    const buffer = asUint8Array(source);
    assert.instanceOf(buffer, Uint8Array);
    assert.strictEqual(buffer.byteLength, 32);
  });

  it("should convert from Uint8Array", () => {
    const buffer = asUint8Array(new Uint8Array(source, 8, 16));
    assert.instanceOf(buffer, Uint8Array);
    assert.strictEqual(buffer.byteLength, 16);
  });

  it("should convert from Uint16Array", () => {
    const buffer = asUint8Array(new Uint16Array(source, 8, 8));
    assert.instanceOf(buffer, Uint8Array);
    assert.strictEqual(buffer.byteLength, 16);
  });

  it("should convert from Uint32Array", () => {
    const buffer = asUint8Array(new Uint32Array(source, 8, 4));
    assert.instanceOf(buffer, Uint8Array);
    assert.strictEqual(buffer.byteLength, 16);
  });

  it("should convert from DataView", () => {
    const buffer = asUint8Array(new DataView(source, 8, 16));
    assert.instanceOf(buffer, Uint8Array);
    assert.strictEqual(buffer.byteLength, 16);
  });
});
