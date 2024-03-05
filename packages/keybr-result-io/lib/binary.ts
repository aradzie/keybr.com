import { type Reader, type Writer } from "@keybr/binary";
import { Layout } from "@keybr/keyboard";
import { Result, TextType } from "@keybr/result";
import { Histogram, type Sample } from "@keybr/textinput";
import { InvalidFormatError } from "./errors.ts";
import { validateHeader } from "./header.ts";

export function writeResult(writer: Writer, result: Result): void {
  const samples = [...result.histogram];
  writer.putUint8(result.layout.xid);
  writer.putUint8(result.textType.xid);
  writer.putUint32(Math.round(result.timeStamp / 1000));
  writer.putUintVlq(result.time);
  writer.putUintVlq(result.length);
  writer.putUintVlq(result.errors);
  writer.putUintVlq(samples.length);
  for (const sample of samples) {
    writer.putUintVlq(sample.codePoint);
    writer.putUintVlq(sample.hitCount);
    writer.putUintVlq(sample.missCount);
    writer.putUintVlq(sample.timeToType);
  }
}

export function writeResults(writer: Writer, results: Iterable<Result>): void {
  for (const result of results) {
    writeResult(writer, result);
  }
}

export function readResult(reader: Reader): Result {
  const layoutXId = reader.getUint8();
  const textTypeXId = reader.getUint8();
  const timestamp = reader.getUint32() * 1000;
  const time = reader.getUintVlq();
  const length = reader.getUintVlq();
  const errors = reader.getUintVlq();
  const size = reader.getUintVlq();
  const samples: Sample[] = [];
  for (let i = 0; i < size; i++) {
    const codePoint = reader.getUintVlq();
    const hitCount = reader.getUintVlq();
    const missCount = reader.getUintVlq();
    const timeToType = reader.getUintVlq();
    samples.push({
      codePoint,
      hitCount,
      missCount,
      timeToType,
    });
  }
  return new Result(
    Layout.ALL.xget(layoutXId),
    TextType.ALL.xget(textTypeXId),
    timestamp,
    length,
    time,
    errors,
    new Histogram(samples),
  );
}

export function* readResults(reader: Reader): Iterable<Result> {
  while (reader.remaining() > 0) {
    yield readResult(reader);
  }
}

export function* readStructuredContent(reader: Reader): Iterable<Result> {
  if (reader.remaining() > 0) {
    if (!validateHeader(reader)) {
      throw new InvalidFormatError("Invalid header");
    }
    try {
      yield* readResults(reader);
    } catch (err: any) {
      throw new InvalidFormatError("Invalid data format", { cause: err });
    }
  }
}
