import { Writer } from "@keybr/binary";
import { Layout } from "@keybr/keyboard";
import { Result, ResultFaker, TextType } from "@keybr/result";
import { Histogram } from "@keybr/textinput";
import test from "ava";
import { writeResult } from "./binary.ts";
import { InvalidFormatError } from "./errors.ts";
import { fileChunk, fileHeader, parseFile } from "./file.ts";
import { HEADER, HEADER_SIGNATURE, HEADER_VERSION } from "./header.ts";

test("format and parse results", (t) => {
  const faker = new ResultFaker();
  const result = faker.nextResult();

  const buffer = Buffer.concat([fileHeader(), fileChunk([result])]);

  t.is(buffer.byteLength, 70);

  t.deepEqual([...parseFile(buffer)], [result]);
});

test("deserialize should ignore empty data", (t) => {
  t.deepEqual([...parseFile(new Uint8Array(0))], []);
});

test("deserialize should validate file header", (t) => {
  const iter = parseFile(new Uint8Array(256));
  const err = t.throws(
    () => {
      [...iter];
    },
    {
      instanceOf: InvalidFormatError,
      message: "Invalid header",
    },
  ) as { cause?: Error };
  t.is(err.cause?.message, undefined);
});

test("deserialize should validate file data", (t) => {
  const writer = new Writer();
  writer.putBuffer(HEADER);
  writer.putUint8(1);
  writer.putUint8(2);
  writer.putUint8(3);
  const iter = parseFile(writer.buffer());
  const err = t.throws(
    () => {
      [...iter];
    },
    {
      instanceOf: InvalidFormatError,
      message: "Invalid data format",
    },
  ) as { cause?: Error };
  t.is(err.cause?.message, "Premature end of data");
});

test("deserialize should read invalid results", (t) => {
  const result = new Result(
    /* layout= */ Layout.EN_US,
    /* textType= */ TextType.GENERATED,
    /* timeStamp= */ Date.parse("2001-02-03T03:05:06Z"),
    /* length= */ 0,
    /* time= */ 0,
    /* errors= */ 0,
    /* histogram= */ new Histogram([]),
  );

  t.false(result.validate());

  const writer = new Writer();
  writer.putUint32(HEADER_SIGNATURE);
  writer.putUint32(HEADER_VERSION);
  writeResult(writer, result);

  const parsed = [...parseFile(writer.buffer())];

  t.deepEqual(parsed, [result]);
});
