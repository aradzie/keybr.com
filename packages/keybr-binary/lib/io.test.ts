import test from "ava";
import { crc32 } from "./crc32.ts";
import { DataError } from "./errors.ts";
import { Reader, Writer } from "./io.ts";

test("validate arguments", (t) => {
  const writer = new Writer();

  t.throws(
    () => {
      writer.putInt8(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt8(-0x80 - 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt8(0xf0 + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint8(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint8(-1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint8(0xff + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt16(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt16(-0x8000 - 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt16(0xf000 + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint16(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint16(-1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint16(0xffff + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt32(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt32(-0x80000000 - 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putInt32(0xf0000000 + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint32(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint32(-1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUint32(0xffffffff + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putIntVlq(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putIntVlq(-0x80000000 - 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putIntVlq(0xf0000000 + 1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUintVlq(Math.PI);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUintVlq(-1);
    },
    { instanceOf: TypeError },
  );
  t.throws(
    () => {
      writer.putUintVlq(0xffffffff + 1);
    },
    { instanceOf: TypeError },
  );

  t.is(crc32(writer.buffer()), 0);

  t.is(writer.buffer().byteLength, 0);
});

test("write and read all types", (t) => {
  const writer = new Writer(4);

  t.is(crc32(writer.buffer()), 0);

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

  t.is(crc32(writer.buffer()), 0x8d315f3f);

  const reader = new Reader(writer.buffer());

  t.is(reader.position(), 0);
  t.is(reader.remaining(), 44);
  t.is(reader.getInt8(), -1);
  t.is(reader.getUint8(), 2);
  t.is(reader.getInt16(), -3);
  t.is(reader.getUint16(), 4);
  t.is(reader.getInt32(), -5);
  t.is(reader.getUint32(), 6);
  t.is(reader.getFloat32(), 7.699999809265137);
  t.is(reader.getFloat64(), 8.888888888888888);
  t.is(reader.getIntVlq(), -9);
  t.is(reader.getUintVlq(), 10);
  t.is(reader.getString(), "hello");
  t.is(reader.getString(), "world");
  t.deepEqual(reader.getBuffer(4), new Uint8Array([0, 1, 2, 3]));
  t.is(reader.position(), 44);
  t.is(reader.remaining(), 0);
});

test("write and read IntVlq", (t) => {
  t.is(new Writer().putIntVlq(0x00000000 >> 0).buffer().byteLength, 1);
  t.is(new Writer().putIntVlq(0x00000001 >> 0).buffer().byteLength, 1);
  t.is(new Writer().putIntVlq(0xffffffff >> 0).buffer().byteLength, 1);
  t.is(new Writer().putIntVlq(0x00000002 >> 0).buffer().byteLength, 1);
  t.is(new Writer().putIntVlq(0xfffffffe >> 0).buffer().byteLength, 1);
  t.is(new Writer().putIntVlq(0x7fffffff >> 0).buffer().byteLength, 5);
  t.is(new Writer().putIntVlq(0x80000000 >> 0).buffer().byteLength, 5);

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

  t.is(reader.getIntVlq(), -2147483648);
  t.is(reader.getIntVlq(), -255);
  t.is(reader.getIntVlq(), -3);
  t.is(reader.getIntVlq(), -2);
  t.is(reader.getIntVlq(), -1);
  t.is(reader.getIntVlq(), 0);
  t.is(reader.getIntVlq(), 1);
  t.is(reader.getIntVlq(), 2);
  t.is(reader.getIntVlq(), 3);
  t.is(reader.getIntVlq(), 255);
  t.is(reader.getIntVlq(), 2147483647);
  t.is(reader.remaining(), 0);
});

test("write and read UintVlq", (t) => {
  t.is(new Writer().putUintVlq(0x00000000).buffer().byteLength, 1);
  t.is(new Writer().putUintVlq(0x00000001).buffer().byteLength, 1);
  t.is(new Writer().putUintVlq(0x0000007f).buffer().byteLength, 1);
  t.is(new Writer().putUintVlq(0x00000080).buffer().byteLength, 2);
  t.is(new Writer().putUintVlq(0x00003f80).buffer().byteLength, 2);
  t.is(new Writer().putUintVlq(0x00003f81).buffer().byteLength, 3);
  t.is(new Writer().putUintVlq(0x001fc000).buffer().byteLength, 3);
  t.is(new Writer().putUintVlq(0x001fc001).buffer().byteLength, 4);
  t.is(new Writer().putUintVlq(0x0fe00000).buffer().byteLength, 4);
  t.is(new Writer().putUintVlq(0x0fe00001).buffer().byteLength, 5);
  t.is(new Writer().putUintVlq(0xffffffff).buffer().byteLength, 5);

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

  t.is(reader.getUintVlq(), 0x00000000);
  t.is(reader.getUintVlq(), 0x00000001);
  t.is(reader.getUintVlq(), 0x0000007f);
  t.is(reader.getUintVlq(), 0x00000080);
  t.is(reader.getUintVlq(), 0x000000ff);
  t.is(reader.getUintVlq(), 0x00000100);
  t.is(reader.getUintVlq(), 0x0000ffff);
  t.is(reader.getUintVlq(), 0x00010000);
  t.is(reader.getUintVlq(), 0xffffffff);
  t.is(reader.remaining(), 0);
});

test("read UintVlq from given examples", (t) => {
  {
    const writer = new Writer();

    writer.putUint8(0x80);
    writer.putUint8(0x80);
    writer.putUint8(0x80);
    writer.putUint8(0x80);
    writer.putUint8(0x00);

    t.is(new Reader(writer.buffer()).getUintVlq(), 0x00000000);
  }

  {
    const writer = new Writer();

    writer.putUint8(0x8f);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0x7f);

    t.is(new Reader(writer.buffer()).getUintVlq(), 0xffffffff);
  }

  {
    const writer = new Writer();

    writer.putUint8(0xff);

    t.throws(
      () => {
        new Reader(writer.buffer()).getUintVlq();
      },
      { instanceOf: DataError },
    );
  }

  {
    const writer = new Writer();

    writer.putUint8(0x90);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0x7f);

    t.throws(
      () => {
        new Reader(writer.buffer()).getUintVlq();
      },
      { instanceOf: DataError },
    );
  }

  {
    const writer = new Writer();

    writer.putUint8(0x8f);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);
    writer.putUint8(0xff);

    t.throws(
      () => {
        new Reader(writer.buffer()).getUintVlq();
      },
      { instanceOf: DataError },
    );
  }
});

test("write and read UTF-8", (t) => {
  const writer = new Writer(4);

  writer.putString("");
  writer.putString("hello");
  writer.putString("🍬🍭");

  const reader = new Reader(writer.buffer());

  t.is(reader.getString(), "");
  t.is(reader.getString(), "hello");
  t.is(reader.getString(), "🍬🍭");
  t.is(reader.remaining(), 0);
});

test("write and read buffer", (t) => {
  const writer = new Writer(4);

  writer.putBuffer(new Uint8Array([0, 1, 2, 3]).buffer);
  writer.putBuffer(new Uint8Array([4, 5, 6, 7]));

  const reader = new Reader(writer.buffer());

  t.deepEqual(reader.getBuffer(4), new Uint8Array([0, 1, 2, 3]));
  t.deepEqual(reader.getBuffer(4), new Uint8Array([4, 5, 6, 7]));
  t.is(reader.remaining(), 0);
});

test("position and remaining", (t) => {
  {
    const reader = new Reader(new Uint8Array(new ArrayBuffer(100), 0, 0));

    t.is(reader.position(), 0);
    t.is(reader.remaining(), 0);

    t.throws(
      () => {
        reader.getBuffer(1);
      },
      { instanceOf: DataError },
    );
  }

  {
    const reader = new Reader(new Uint8Array(new ArrayBuffer(100)));

    t.is(reader.position(), 0);
    t.is(reader.remaining(), 100);

    reader.getBuffer(50);

    t.is(reader.position(), 50);
    t.is(reader.remaining(), 50);

    reader.getBuffer(50);

    t.is(reader.position(), 100);
    t.is(reader.remaining(), 0);
  }
});
