import { type Reader, type Writer } from "@keybr/binary";
import { Layout } from "@keybr/layout";
import { InvalidResultError, Result, TextType } from "@keybr/result";
import { Histogram, type Sample } from "@keybr/textinput";
import { InvalidFormatError } from "./errors.ts";
import { validateHeader } from "./header.ts";

export function writeResult(
  writer: Writer,
  { layout, textType, timeStamp, time, length, errors, histogram }: Result,
): void {
  const samples = [...histogram];
  writer.putUint8(layout.xid);
  writer.putUint8(textType.xid);
  writer.putUint32(Math.round(timeStamp / 1000));
  writer.putUintVlq(time);
  writer.putUintVlq(length);
  writer.putUintVlq(errors);
  writer.putUintVlq(samples.length);
  for (const { codePoint, hitCount, missCount, timeToType } of samples) {
    writer.putUintVlq(codePoint);
    writer.putUintVlq(hitCount);
    writer.putUintVlq(missCount);
    writer.putUintVlq(timeToType);
  }
}

export function writeResults(writer: Writer, results: Iterable<Result>): void {
  for (const result of results) {
    if (!result.validate()) {
      throw new InvalidResultError("Invalid result");
    }
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
    const result = readResult(reader);
    if (result.validate()) {
      yield result;
    }
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
