import { describe, it } from "node:test";
import { equal, isInstanceOf } from "rich-assert";
import { asUint8Array } from "./util.ts";

describe("convert to Uint8Array", () => {
  const source = new ArrayBuffer(32);

  it("should convert from ArrayBuffer", () => {
    const buffer = asUint8Array(source);
    isInstanceOf(buffer, Uint8Array);
    equal(buffer.byteLength, 32);
  });

  it("should convert from Uint8Array", () => {
    const buffer = asUint8Array(new Uint8Array(source, 8, 16));
    isInstanceOf(buffer, Uint8Array);
    equal(buffer.byteLength, 16);
  });

  it("should convert from Uint16Array", () => {
    const buffer = asUint8Array(new Uint16Array(source, 8, 8));
    isInstanceOf(buffer, Uint8Array);
    equal(buffer.byteLength, 16);
  });

  it("should convert from Uint32Array", () => {
    const buffer = asUint8Array(new Uint32Array(source, 8, 4));
    isInstanceOf(buffer, Uint8Array);
    equal(buffer.byteLength, 16);
  });

  it("should convert from DataView", () => {
    const buffer = asUint8Array(new DataView(source, 8, 16));
    isInstanceOf(buffer, Uint8Array);
    equal(buffer.byteLength, 16);
  });
});
