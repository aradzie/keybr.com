import { Writer } from "@keybr/binary";
import { ResultFaker } from "@keybr/result";
import { HEADER, writeResult } from "@keybr/result-io";
import test from "ava";
import { checkFile, type FileStatus } from "./check-file.ts";

const faker = new ResultFaker();
const r0 = faker.nextResult();
const r1 = faker.nextResult();
const r2 = faker.nextResult();
const rx = faker.nextResult({ length: 0, time: 0 });

test("check empty file", (t) => {
  // Arrange.

  const writer = new Writer();
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "bad",
    results: [],
    invalid: [],
  } satisfies FileStatus);
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
    type: "bad",
    results: [],
    invalid: [],
  } satisfies FileStatus);
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
    type: "bad",
    results: [],
    invalid: [],
  } satisfies FileStatus);
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
    type: "bad",
    results: [r0, r1, r2],
    invalid: [],
  } satisfies FileStatus);
});

test("check invalid results", (t) => {
  // Arrange.

  const writer = new Writer();
  writer.putBuffer(HEADER);
  writeResult(writer, rx);
  writeResult(writer, r0);
  writeResult(writer, r1);
  writeResult(writer, r2);
  const buffer = writer.buffer();

  // Act.

  const status = checkFile(buffer);

  // Assert.

  t.deepEqual(status, {
    type: "bad",
    results: [r0, r1, r2],
    invalid: [rx],
  } satisfies FileStatus);
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
    type: "good",
    results: [r0, r1, r2],
  } satisfies FileStatus);
});
