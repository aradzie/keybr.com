import { Reader } from "@keybr/binary";
import { type Result } from "@keybr/result";
import { readResult, validateHeader } from "@keybr/result-io";

export type FileStatus =
  | {
      readonly type: "bad_file";
      /** The recovered results. */
      readonly results: readonly Result[];
      /** Total file size. */
      readonly fileSize: number;
      /** Valid data size. */
      readonly readSize: number;
    }
  | {
      readonly type: "good_file";
      /** The results. */
      readonly results: readonly Result[];
    };

export function checkFile(buffer: Uint8Array): FileStatus {
  return checkFile0(new Reader(buffer));
}

function checkFile0(reader: Reader): FileStatus {
  const results: Result[] = [];
  const fileSize = reader.remaining();
  let readSize = reader.position();
  if (!validateHeader(reader)) {
    return { type: "bad_file", results, fileSize, readSize };
  }
  readSize = reader.position();
  while (reader.remaining() > 0) {
    try {
      results.push(readResult(reader));
    } catch {
      return { type: "bad_file", results, fileSize, readSize };
    }
    readSize = reader.position();
  }
  if (results.length === 0) {
    return { type: "bad_file", results, fileSize, readSize };
  }
  return { type: "good_file", results };
}
