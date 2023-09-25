import { crc32 } from "./crc32.ts";
import { DataError } from "./errors.ts";
import { asUint8Array } from "./util.ts";

export function scramble(
  buffer: ArrayBufferLike | ArrayBufferView,
): Uint8Array {
  const array = asUint8Array(buffer);
  const k = key();
  const r = new Uint8Array(array.length + 8);
  setUint32(r, 0, k);
  setUint32(r, 4, crc32(array));
  r.set(array, 8);
  update(k, r);
  return r;
}

export function unscramble(
  buffer: ArrayBufferLike | ArrayBufferView,
): Uint8Array {
  const array = asUint8Array(buffer);
  if (array.length < 8) {
    throw new DataError();
  }
  const k = getUint32(array, 0);
  update(k, array);
  const c = getUint32(array, 4);
  const r = array.subarray(8);
  if (crc32(r) !== c) {
    throw new DataError();
  }
  return r;
}

function update(k: number, a: Uint8Array): void {
  const g = stream(k);
  for (let i = 4; i < a.length; i++) {
    a[i] = a[i] ^ g();
  }
}

function key(): number {
  return Math.floor(Math.random() * 0x100000000);
}

function stream(seed: number): () => number {
  let v = (modMultiply(seed, 0x7fffffed) + 0x00c39ec3) >>> 0;
  return function (): number {
    return (v = (modMultiply(v, 0x0019660d) + 0x3c6ef35f) >>> 0);
  };
}

function getUint32(a: Uint8Array, p: number): number {
  const v0 = (a[p + 0] << 0x18) >>> 0;
  const v1 = (a[p + 1] << 0x10) >>> 0;
  const v2 = (a[p + 2] << 0x08) >>> 0;
  const v3 = (a[p + 3] << 0x00) >>> 0;
  return (v0 | v1 | v2 | v3) >>> 0;
}

function setUint32(a: Uint8Array, p: number, v: number): void {
  a[p + 0] = v >>> 0x18;
  a[p + 1] = v >>> 0x10;
  a[p + 2] = v >>> 0x08;
  a[p + 3] = v >>> 0x00;
}

/**
 * Multiply modulo 0xFFFFFFFF.
 */
function modMultiply(a: number, b: number): number {
  a = a >>> 0;
  b = b >>> 0;
  let r = 0;
  for (let i = 0; i < 32; i++) {
    if (((b >>> i) & 1) === 1) {
      r += a << i;
    }
  }
  return r >>> 0;
}
