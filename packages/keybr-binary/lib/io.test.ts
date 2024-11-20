import { describe, it, test } from "node:test";
import { deepEqual, equal, throws } from "rich-assert";
import { crc32 } from "./crc32.ts";
import { DataError } from "./errors.ts";
import { Reader, Writer } from "./io.ts";

test("validate arguments", () => {
  const writer = new Writer();

  throws(() => {
    writer.putInt8(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putInt8(-0x80 - 1);
  }, TypeError);
  throws(() => {
    writer.putInt8(0xf0 + 1);
  }, TypeError);
  throws(() => {
    writer.putUint8(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putUint8(-1);
  }, TypeError);
  throws(() => {
    writer.putUint8(0xff + 1);
  }, TypeError);
  throws(() => {
    writer.putInt16(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putInt16(-0x8000 - 1);
  }, TypeError);
  throws(() => {
    writer.putInt16(0xf000 + 1);
  }, TypeError);
  throws(() => {
    writer.putUint16(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putUint16(-1);
  }, TypeError);
  throws(() => {
    writer.putUint16(0xffff + 1);
  }, TypeError);
  throws(() => {
    writer.putInt32(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putInt32(-0x80000000 - 1);
  }, TypeError);
  throws(() => {
    writer.putInt32(0xf0000000 + 1);
  }, TypeError);
  throws(() => {
    writer.putUint32(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putUint32(-1);
  }, TypeError);
  throws(() => {
    writer.putUint32(0xffffffff + 1);
  }, TypeError);
  throws(() => {
    writer.putIntVlq(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putIntVlq(-0x80000000 - 1);
  }, TypeError);
  throws(() => {
    writer.putIntVlq(0xf0000000 + 1);
  }, TypeError);
  throws(() => {
    writer.putUintVlq(Math.PI);
  }, TypeError);
  throws(() => {
    writer.putUintVlq(-1);
  }, TypeError);
  throws(() => {
    writer.putUintVlq(0xffffffff + 1);
  }, TypeError);

  equal(crc32(writer.buffer()), 0);

  equal(writer.buffer().byteLength, 0);
});

test("write and read all data types", () => {
  const writer = new Writer(4);

  equal(crc32(writer.buffer()), 0);

  writer.putInt8(-1);
  writer.putUint8(2);
  writer.putInt16(-3);
  writer.putUint16(4);
  writer.putInt32(-5);
  writer.putUint32(6);
  writer.putFloat32(7.699999809265137);
  writer.putFloat64(8.888888888888888);
  writer.putIntVlq(-9);
  writer.putUintVlq(10);
  writer.putString("hello");
  writer.putString("world");
  writer.putBuffer(new Uint8Array([0, 1, 2, 3]));

  equal(crc32(writer.buffer()), 0x8d315f3f);

  const reader = new Reader(writer.buffer());

  equal(reader.position(), 0);
  equal(reader.remaining(), 44);
  equal(reader.getInt8(), -1);
  equal(reader.getUint8(), 2);
  equal(reader.getInt16(), -3);
  equal(reader.getUint16(), 4);
  equal(reader.getInt32(), -5);
  equal(reader.getUint32(), 6);
  equal(reader.getFloat32(), 7.699999809265137);
  equal(reader.getFloat64(), 8.888888888888888);
  equal(reader.getIntVlq(), -9);
  equal(reader.getUintVlq(), 10);
  equal(reader.getString(), "hello");
  equal(reader.getString(), "world");
  deepEqual(reader.getBuffer(4), new Uint8Array([0, 1, 2, 3]));
  equal(reader.position(), 44);
  equal(reader.remaining(), 0);
});

test("write and read IntVlq", () => {
  equal(new Writer().putIntVlq(0x00000000 >> 0).buffer().byteLength, 1);
  equal(new Writer().putIntVlq(0x00000001 >> 0).buffer().byteLength, 1);
  equal(new Writer().putIntVlq(0xffffffff >> 0).buffer().byteLength, 1);
  equal(new Writer().putIntVlq(0x00000002 >> 0).buffer().byteLength, 1);
  equal(new Writer().putIntVlq(0xfffffffe >> 0).buffer().byteLength, 1);
  equal(new Writer().putIntVlq(0x7fffffff >> 0).buffer().byteLength, 5);
  equal(new Writer().putIntVlq(0x80000000 >> 0).buffer().byteLength, 5);

  const writer = new Writer();

  writer.putIntVlq(-2147483648);
  writer.putIntVlq(-255);
  writer.putIntVlq(-3);
  writer.putIntVlq(-2);
  writer.putIntVlq(-1);
  writer.putIntVlq(0);
  writer.putIntVlq(1);
  writer.putIntVlq(2);
  writer.putIntVlq(3);
  writer.putIntVlq(255);
  writer.putIntVlq(2147483647);

  const reader = new Reader(writer.buffer());

  equal(reader.getIntVlq(), -2147483648);
  equal(reader.getIntVlq(), -255);
  equal(reader.getIntVlq(), -3);
  equal(reader.getIntVlq(), -2);
  equal(reader.getIntVlq(), -1);
  equal(reader.getIntVlq(), 0);
  equal(reader.getIntVlq(), 1);
  equal(reader.getIntVlq(), 2);
  equal(reader.getIntVlq(), 3);
  equal(reader.getIntVlq(), 255);
  equal(reader.getIntVlq(), 2147483647);
  equal(reader.remaining(), 0);
});

test("write and read UintVlq", () => {
  equal(new Writer().putUintVlq(0x00000000).buffer().byteLength, 1);
  equal(new Writer().putUintVlq(0x00000001).buffer().byteLength, 1);
  equal(new Writer().putUintVlq(0x0000007f).buffer().byteLength, 1);
  equal(new Writer().putUintVlq(0x00000080).buffer().byteLength, 2);
  equal(new Writer().putUintVlq(0x00003f80).buffer().byteLength, 2);
  equal(new Writer().putUintVlq(0x00003f81).buffer().byteLength, 3);
  equal(new Writer().putUintVlq(0x001fc000).buffer().byteLength, 3);
  equal(new Writer().putUintVlq(0x001fc001).buffer().byteLength, 4);
  equal(new Writer().putUintVlq(0x0fe00000).buffer().byteLength, 4);
  equal(new Writer().putUintVlq(0x0fe00001).buffer().byteLength, 5);
  equal(new Writer().putUintVlq(0xffffffff).buffer().byteLength, 5);

  const writer = new Writer();

  writer.putUintVlq(0x00000000);
  writer.putUintVlq(0x00000001);
  writer.putUintVlq(0x0000007f);
  writer.putUintVlq(0x00000080);
  writer.putUintVlq(0x000000ff);
  writer.putUintVlq(0x00000100);
  writer.putUintVlq(0x0000ffff);
  writer.putUintVlq(0x00010000);
  writer.putUintVlq(0xffffffff);

  const reader = new Reader(writer.buffer());

  equal(reader.getUintVlq(), 0x00000000);
  equal(reader.getUintVlq(), 0x00000001);
  equal(reader.getUintVlq(), 0x0000007f);
  equal(reader.getUintVlq(), 0x00000080);
  equal(reader.getUintVlq(), 0x000000ff);
  equal(reader.getUintVlq(), 0x00000100);
  equal(reader.getUintVlq(), 0x0000ffff);
  equal(reader.getUintVlq(), 0x00010000);
  equal(reader.getUintVlq(), 0xffffffff);
  equal(reader.remaining(), 0);
});

describe("read UintVlq from the given examples", () => {
  it("should read 0x00000000", () => {
    const writer = new Writer();

    writer.putUint8(0x80);
    writer.putUint8(0x80);
    writer.putUint8(0x80);
    writer.putUint8(0x80);
    writer.putUint8(0x00);

    equal(new Reader(writer.buffer()).getUintVlq(), 0x00000000);
  });

  it("should read 0xffffffff", () => {
    const writer = new Writer();

    writer.putUint8(0x8f);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0x7f);

    equal(new Reader(writer.buffer()).getUintVlq(), 0xffffffff);
  });
});

describe("handle UintVlq read errors", () => {
  it("should throw an error if the input data is too short", () => {
    const writer = new Writer();

    writer.putUint8(0xff);

    throws(
      () => {
        new Reader(writer.buffer()).getUintVlq();
      },
      DataError,
      "Premature end of data",
    );
  });

  it("should throw an error if too many leading bits", () => {
    const writer = new Writer();

    writer.putUint8(0x90);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0x7f);

    throws(
      () => {
        new Reader(writer.buffer()).getUintVlq();
      },
      DataError,
      "Too many leading bits",
    );
  });

  it("should throw an error if too many trailing bits", () => {
    const writer = new Writer();

    writer.putUint8(0x8f);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);

    throws(
      () => {
        new Reader(writer.buffer()).getUintVlq();
      },
      DataError,
      "Too many trailing bits",
    );
  });
});

test("write and read a string", () => {
  const writer = new Writer(4);

  writer.putString("");
  writer.putString("hello");
  writer.putString("🍬🍭");

  const reader = new Reader(writer.buffer());

  equal(reader.getString(), "");
  equal(reader.getString(), "hello");
  equal(reader.getString(), "🍬🍭");
  equal(reader.remaining(), 0);
});

test("write and read a buffer", () => {
  const writer = new Writer(4);

  writer.putBuffer(new Uint8Array([0, 1, 2, 3]).buffer);
  writer.putBuffer(new Uint8Array([4, 5, 6, 7]));

  const reader = new Reader(writer.buffer());

  deepEqual(reader.getBuffer(4), new Uint8Array([0, 1, 2, 3]));
  deepEqual(reader.getBuffer(4), new Uint8Array([4, 5, 6, 7]));
  equal(reader.remaining(), 0);
});

test("read to the end of input", () => {
  const reader = new Reader(new Uint8Array(new ArrayBuffer(100)));

  equal(reader.position(), 0);
  equal(reader.remaining(), 100);

  reader.getBuffer(50);

  equal(reader.position(), 50);
  equal(reader.remaining(), 50);

  reader.getBuffer(50);

  equal(reader.position(), 100);
  equal(reader.remaining(), 0);
});

test("throw an error if reading past the end of input", () => {
  const reader = new Reader(new Uint8Array(new ArrayBuffer(100), 0, 0));

  equal(reader.position(), 0);
  equal(reader.remaining(), 0);

  throws(() => {
    reader.getBuffer(1);
  }, DataError);
});
