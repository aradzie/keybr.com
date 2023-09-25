import { asUint8Array } from "./util.ts";

const table: readonly number[] = (() => {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c;
  }
  return table;
})();

/**
 * Calculate CRC32 of the specified array.
 */
export function crc32(buffer: ArrayBufferLike | ArrayBufferView): number {
  const array = asUint8Array(buffer);
  let crc = 0xffffffff;
  for (let i = 0; i < array.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ array[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}
