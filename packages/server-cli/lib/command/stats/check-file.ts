import { Reader } from "@keybr/binary";
import { type Result } from "@keybr/result";
import { readResult, validateHeader } from "@keybr/result-io";

export type FileStatus =
  | {
      readonly type: "bad";
      /** The recovered results. */
      readonly results: readonly Result[];
      /** The recovered invalid results. */
      readonly invalid: readonly Result[];
    }
  | {
      readonly type: "good";
      /** The results. */
      readonly results: readonly Result[];
    };

export function checkFile(buffer: Uint8Array): FileStatus {
  return checkFile0(new Reader(buffer));
}

function checkFile0(reader: Reader): FileStatus {
  const results: Result[] = [];
  const invalid: Result[] = [];
  if (!validateHeader(reader)) {
    return { type: "bad", results, invalid };
  }
  while (reader.remaining() > 0) {
    let result;
    try {
      result = readResult(reader);
    } catch {
      return { type: "bad", results, invalid };
    }
    if (result.validate()) {
      results.push(result);
    } else {
      invalid.push(result);
    }
  }
  if (results.length === 0 || invalid.length > 0) {
    return { type: "bad", results, invalid };
  }
  return { type: "good", results };
}
