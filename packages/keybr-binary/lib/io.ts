import { DataError } from "./errors.ts";
import { decode, encode, encodedByteCount } from "./utf8.ts";
import { asUint8Array } from "./util.ts";

export class Writer {
  #dataView: DataView;
  #byteOffset: number;

  constructor(byteLength: number = 64) {
    this.#dataView = new DataView(new ArrayBuffer(Math.max(byteLength, 64)));
    this.#byteOffset = 0;
  }

  #ensureSize(byteLength: number): void {
    if (this.#dataView.byteLength < byteLength) {
      let totalSize = 64;
      while (totalSize < byteLength) {
        totalSize *= totalSize;
      }
      const buffer = new ArrayBuffer(totalSize);
      new Uint8Array(buffer).set(new Uint8Array(this.#dataView.buffer));
      this.#dataView = new DataView(buffer);
    }
  }

  #ensureAvailable(byteLength: number): void {
    this.#ensureSize(this.#byteOffset + byteLength);
  }

  putInt8(value: number): this {
    if (!Number.isInteger(value) || value < -0x80 || value > 0x7f) {
      throw new TypeError("Value is not int8");
    }
    this.#ensureAvailable(1);
    this.#dataView.setInt8(this.#byteOffset, value);
    this.#byteOffset += 1;
    return this;
  }

  putUint8(value: number): this {
    if (!Number.isInteger(value) || value < 0 || value > 0xff) {
      throw new TypeError("Value is not uint8");
    }
    this.#ensureAvailable(1);
    this.#dataView.setUint8(this.#byteOffset, value);
    this.#byteOffset += 1;
    return this;
  }

  putInt16(value: number): this {
    if (!Number.isInteger(value) || value < -0x8000 || value > 0x7fff) {
      throw new TypeError("Value is not int16");
    }
    this.#ensureAvailable(2);
    this.#dataView.setInt16(this.#byteOffset, value, false);
    this.#byteOffset += 2;
    return this;
  }

  putUint16(value: number): this {
    if (!Number.isInteger(value) || value < 0 || value > 0xffff) {
      throw new TypeError("Value is not uint16");
    }
    this.#ensureAvailable(2);
    this.#dataView.setUint16(this.#byteOffset, value, false);
    this.#byteOffset += 2;
    return this;
  }

  putInt32(value: number): this {
    if (!Number.isInteger(value) || value < -0x80000000 || value > 0x7fffffff) {
      throw new TypeError("Value is not int32");
    }
    this.#ensureAvailable(4);
    this.#dataView.setInt32(this.#byteOffset, value, false);
    this.#byteOffset += 4;
    return this;
  }

  putUint32(value: number): this {
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
      throw new TypeError("Value is not uint32");
    }
    this.#ensureAvailable(4);
    this.#dataView.setUint32(this.#byteOffset, value, false);
    this.#byteOffset += 4;
    return this;
  }

  putFloat32(value: number): this {
    this.#ensureAvailable(4);
    this.#dataView.setFloat32(this.#byteOffset, value, false);
    this.#byteOffset += 4;
    return this;
  }

  putFloat64(value: number): this {
    this.#ensureAvailable(8);
    this.#dataView.setFloat64(this.#byteOffset, value, false);
    this.#byteOffset += 8;
    return this;
  }

  putIntVlq(value: number): this {
    if (!Number.isInteger(value) || value < -0x80000000 || value > 0x7fffffff) {
      throw new TypeError("Value is not int32");
    }
    this.putUintVlq(((value << 1) ^ (value >> 31)) >>> 0);
    return this;
  }

  putUintVlq(value: number): this {
    if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
      throw new TypeError("Value is not uint32");
    }
    this.#putVlq(value);
    return this;
  }

  #putVlq(value: number): void {
    if (value > 266338304) {
      this.putUint8(((value >>> 28) & 15) | 128);
    }
    if (value > 2080768) {
      this.putUint8(((value >>> 21) & 127) | 128);
    }
    if (value > 16256) {
      this.putUint8(((value >>> 14) & 127) | 128);
    }
    if (value > 127) {
      this.putUint8(((value >>> 7) & 127) | 128);
    }
    this.putUint8(value & 127);
  }

  putString(value: string): this {
    const byteLength = encodedByteCount(value);
    this.putUintVlq(byteLength);
    this.#ensureAvailable(byteLength);
    encode(value, this.#dataView, this.#byteOffset);
    this.#byteOffset += byteLength;
    return this;
  }

  putBuffer(buffer: ArrayBufferLike | ArrayBufferView): this {
    const array = asUint8Array(buffer);
    this.#ensureAvailable(array.byteLength);
    new Uint8Array(this.#dataView.buffer).set(array, this.#byteOffset);
    this.#byteOffset += array.byteLength;
    return this;
  }

  buffer(): Uint8Array {
    return new Uint8Array(this.#dataView.buffer, 0, this.#byteOffset);
  }
}

export class Reader {
  readonly #dataView: DataView;
  #byteOffset: number = 0;

  constructor(buffer: ArrayBufferLike | ArrayBufferView) {
    if (ArrayBuffer.isView(buffer)) {
      this.#dataView = new DataView(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      );
    } else {
      this.#dataView = new DataView(buffer);
    }
  }

  #ensureAvailable(byteLength: number): void {
    if (this.#byteOffset + byteLength > this.#dataView.byteLength) {
      throw new DataError("Premature end of data");
    }
  }

  getInt8(): number {
    this.#ensureAvailable(1);
    const value = this.#dataView.getInt8(this.#byteOffset);
    this.#byteOffset += 1;
    return value;
  }

  getUint8(): number {
    this.#ensureAvailable(1);
    const value = this.#dataView.getUint8(this.#byteOffset);
    this.#byteOffset += 1;
    return value;
  }

  getInt16(): number {
    this.#ensureAvailable(2);
    const value = this.#dataView.getInt16(this.#byteOffset, false);
    this.#byteOffset += 2;
    return value;
  }

  getUint16(): number {
    this.#ensureAvailable(2);
    const value = this.#dataView.getUint16(this.#byteOffset, false);
    this.#byteOffset += 2;
    return value;
  }

  getInt32(): number {
    this.#ensureAvailable(4);
    const value = this.#dataView.getInt32(this.#byteOffset, false);
    this.#byteOffset += 4;
    return value;
  }

  getUint32(): number {
    this.#ensureAvailable(4);
    const value = this.#dataView.getUint32(this.#byteOffset, false);
    this.#byteOffset += 4;
    return value;
  }

  getFloat32(): number {
    this.#ensureAvailable(4);
    const value = this.#dataView.getFloat32(this.#byteOffset, false);
    this.#byteOffset += 4;
    return value;
  }

  getFloat64(): number {
    this.#ensureAvailable(8);
    const value = this.#dataView.getFloat64(this.#byteOffset, false);
    this.#byteOffset += 8;
    return value;
  }

  getIntVlq(): number {
    const value = this.getUintVlq();
    return (value >>> 1) ^ -(value & 1); // from zig-zag back to two's-complement
  }

  getUintVlq(): number {
    return this.#getVlq();
  }

  #getVlq(): number {
    let value = 0;
    const b0 = this.getUint8();
    value = ((value << 7) | (b0 & 0x7f)) >>> 0;
    if ((b0 & 0x80) === 0) {
      return value;
    }
    const b1 = this.getUint8();
    value = ((value << 7) | (b1 & 0x7f)) >>> 0;
    if ((b1 & 0x80) === 0) {
      return value;
    }
    const b2 = this.getUint8();
    value = ((value << 7) | (b2 & 0x7f)) >>> 0;
    if ((b2 & 0x80) === 0) {
      return value;
    }
    const b3 = this.getUint8();
    value = ((value << 7) | (b3 & 0x7f)) >>> 0;
    if ((b3 & 0x80) === 0) {
      return value;
    }
    const b4 = this.getUint8();
    value = ((value << 7) | (b4 & 0x7f)) >>> 0;
    if ((b4 & 0x80) === 0) {
      if ((b0 & 0x7f) > 15) {
        throw new DataError("Too many leading bits");
      }
      return value;
    }
    throw new DataError("Too many trailing bits");
  }

  getString(): string {
    const byteLength = this.getUintVlq();
    this.#ensureAvailable(byteLength);
    const value = decode(this.#dataView, this.#byteOffset, byteLength);
    this.#byteOffset += byteLength;
    return value;
  }

  getBuffer(byteLength: number): Uint8Array {
    this.#ensureAvailable(byteLength);
    const buffer = new Uint8Array(
      this.#dataView.buffer,
      this.#byteOffset,
      byteLength,
    );
    this.#byteOffset += byteLength;
    return buffer;
  }

  position(): number {
    return this.#byteOffset;
  }

  remaining(): number {
    return this.#dataView.byteLength - this.#byteOffset;
  }
}
