import { DataError } from "./errors.ts";

/**
 * Get number of UTF8 bytes for the specified string.
 * @param value A string.
 * @return Number of UTF8 bytes.
 */
export function encodedByteCount(value: string): number {
  // length   byte[0]    byte[1]    byte[2]    byte[3]
  // 1        0b0xxxxxxx
  // 2        0b110xxxxx 0b10xxxxxx
  // 3        0b1110xxxx 0b10xxxxxx 0b10xxxxxx
  // 4        0b11110xxx 0b10xxxxxx 0b10xxxxxx 0b10xxxxxx

  let byteCount = 0;
  let i = 0;
  while (i < value.length) {
    const codePoint = value.codePointAt(i) ?? 0;
    if (codePoint <= 0x7f) {
      byteCount += 1;
      i += 1;
    } else if (codePoint <= 0x7ff) {
      byteCount += 2;
      i += 1;
    } else if (codePoint <= 0xffff) {
      byteCount += 3;
      i += 1;
    } else if (codePoint <= 0x10ffff) {
      byteCount += 4;
      i += 2;
    }
  }
  return byteCount;
}

/**
 * Write string as UTF8 bytes.
 * @param value A string to encode.
 * @param buffer An array to write bytes to.
 * @param byteOffset Byte offset in the array.
 * @return Updated byte offset in the array.
 */
export function encode(
  value: string,
  buffer: DataView,
  byteOffset: number,
): number {
  let i = 0;
  while (i < value.length) {
    const codePoint = value.codePointAt(i) ?? 0;
    if (codePoint <= 0x7f) {
      buffer.setUint8(byteOffset++, codePoint);
      i += 1;
    } else if (codePoint <= 0x7ff) {
      buffer.setUint8(byteOffset++, ((codePoint >> 6) & 0x1f) | 0xc0);
      buffer.setUint8(byteOffset++, ((codePoint >> 0) & 0x3f) | 0x80);
      i += 1;
    } else if (codePoint <= 0xffff) {
      buffer.setUint8(byteOffset++, ((codePoint >> 12) & 0x0f) | 0xe0);
      buffer.setUint8(byteOffset++, ((codePoint >> 6) & 0x3f) | 0x80);
      buffer.setUint8(byteOffset++, ((codePoint >> 0) & 0x3f) | 0x80);
      i += 1;
    } else if (codePoint <= 0x10ffff) {
      buffer.setUint8(byteOffset++, ((codePoint >> 18) & 0x7f) | 0xf0);
      buffer.setUint8(byteOffset++, ((codePoint >> 12) & 0x3f) | 0x80);
      buffer.setUint8(byteOffset++, ((codePoint >> 6) & 0x3f) | 0x80);
      buffer.setUint8(byteOffset++, ((codePoint >> 0) & 0x3f) | 0x80);
      i += 2;
    }
  }
  return byteOffset;
}

/**
 * Read string from UTF8 bytes.
 * @param buffer An array to read bytes from.
 * @param byteOffset Byte offset in the array.
 * @param byteLength Number of bytes to read.
 * @return String from UTF8 bytes.
 */
export function decode(
  buffer: DataView,
  byteOffset: number,
  byteLength: number,
): string {
  let value = "";
  const endOffset = byteOffset + byteLength;
  while (byteOffset < endOffset) {
    const b0 = buffer.getUint8(byteOffset++);
    if (b0 < 0x80) {
      value += String.fromCodePoint(b0);
    } else if ((b0 & 0xe0) === 0xc0) {
      if (byteOffset + 1 > endOffset) {
        throw new DataError("Truncated UTF-8 stream");
      }
      const b1 = buffer.getUint8(byteOffset++);
      const codePoint = ((b0 & 0x1f) << 6) | ((b1 & 0x3f) << 0);
      value += String.fromCodePoint(codePoint);
    } else if ((b0 & 0xf0) === 0xe0) {
      if (byteOffset + 2 > endOffset) {
        throw new DataError("Truncated UTF-8 stream");
      }
      const b1 = buffer.getUint8(byteOffset++);
      const b2 = buffer.getUint8(byteOffset++);
      const codePoint =
        ((b0 & 0x0f) << 12) | ((b1 & 0x3f) << 6) | ((b2 & 0x3f) << 0);
      value += String.fromCodePoint(codePoint);
    } else if ((b0 & 0xf8) === 0xf0) {
      if (byteOffset + 3 > endOffset) {
        throw new DataError("Truncated UTF-8 stream");
      }
      const b1 = buffer.getUint8(byteOffset++);
      const b2 = buffer.getUint8(byteOffset++);
      const b3 = buffer.getUint8(byteOffset++);
      const codePoint =
        ((b0 & 0x07) << 18) |
        ((b1 & 0x3f) << 12) |
        ((b2 & 0x3f) << 6) |
        ((b3 & 0x3f) << 0);
      if (codePoint > 0x10ffff) {
        throw new DataError("Invalid code point");
      }
      value += String.fromCodePoint(codePoint);
    } else {
      throw new DataError("Broken UTF-8 stream");
    }
  }
  return value;
}
