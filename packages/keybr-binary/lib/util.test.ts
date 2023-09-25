import test from "ava";
import { asUint8Array } from "./util.ts";

test("convert to Uint8Array", (t) => {
  const source = new ArrayBuffer(32);

  {
    const buffer = asUint8Array(source);
    t.true(buffer instanceof Uint8Array);
    t.is(buffer.byteLength, 32);
  }

  {
    const buffer = asUint8Array(new Uint8Array(source, 8, 16));
    t.true(buffer instanceof Uint8Array);
    t.is(buffer.byteLength, 16);
  }

  {
    const buffer = asUint8Array(new Uint16Array(source, 8, 8));
    t.true(buffer instanceof Uint8Array);
    t.is(buffer.byteLength, 16);
  }

  {
    const buffer = asUint8Array(new Uint32Array(source, 8, 4));
    t.true(buffer instanceof Uint8Array);
    t.is(buffer.byteLength, 16);
  }

  {
    const buffer = asUint8Array(new DataView(source, 8, 16));
    t.true(buffer instanceof Uint8Array);
    t.is(buffer.byteLength, 16);
  }
});
