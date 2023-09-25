import { Reader, scramble, unscramble, Writer } from "@keybr/binary";
import { type Result } from "@keybr/result";
import { readStructuredContent, writeResults } from "./binary.ts";
import { HEADER } from "./header.ts";

export function formatMessage(results: Iterable<Result>): Uint8Array {
  const writer = new Writer();
  writer.putBuffer(HEADER);
  writeResults(writer, results);
  return scramble(writer.buffer());
}

export function parseMessage(buffer: Uint8Array): Iterable<Result> {
  return readStructuredContent(new Reader(unscramble(buffer)));
}
