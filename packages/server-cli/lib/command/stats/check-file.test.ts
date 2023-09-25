import { Writer } from "@keybr/binary";
import { ResultFaker } from "@keybr/result";
import { HEADER, writeResult } from "@keybr/result-io";
import test from "ava";
import { checkFile } from "./check-file.ts";

const faker = new ResultFaker();
const r0 = faker.nextResult();
const r1 = faker.nextResult();
const r2 = faker.nextResult();

test("check empty file", (t) => {
  // Arrange.

  const writer = new Writer();
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "bad_file",
    results: [],
    fileSize: 0,
    readSize: 0,
  });
});

test("check invalid header", (t) => {
  // Arrange.

  const writer = new Writer();
  writer.putInt32(0);
  writer.putInt32(0);
  writer.putInt32(0);
  writer.putInt32(0);
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "bad_file",
    results: [],
    fileSize: 16,
    readSize: 0,
  });
});

test("check invalid data", (t) => {
  // Arrange.

  const writer = new Writer();
  writer.putBuffer(HEADER);
  writeResult(writer, r0);
  writeResult(writer, r1);
  writeResult(writer, r2);
  writer.putInt32(0);
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "bad_file",
    results: [r0, r1, r2],
    fileSize: 198,
    readSize: 194,
  });
});

test("check empty data", (t) => {
  // Arrange.

  const writer = new Writer();
  writer.putBuffer(HEADER);
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "bad_file",
    results: [],
    fileSize: 8,
    readSize: 8,
  });
});

test("check valid non-empty data", (t) => {
  // Arrange.

  const writer = new Writer();
  writer.putBuffer(HEADER);
  writeResult(writer, r0);
  writeResult(writer, r1);
  writeResult(writer, r2);
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "good_file",
    results: [r0, r1, r2],
  });
});
