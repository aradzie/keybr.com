import { type Step } from "@keybr/textinput";
import {
  type LengthLimit,
  type Limit,
  type Progress,
  type TimeLimit,
} from "./types.ts";

export function timeLimit(time: number): TimeLimit {
  return { type: "time", time };
}

export function lengthLimit(length: number): LengthLimit {
  return { type: "length", length };
}

export const limit_15_seconds = timeLimit(15_000);
export const limit_30_seconds = timeLimit(30_000);
export const limit_60_seconds = timeLimit(60_000);
export const limit_100_chars = lengthLimit(100);
export const limit_500_chars = lengthLimit(500);
export const limit_1000_chars = lengthLimit(1000);

export type NamedLimit = {
  readonly label: string;
  readonly limit: Limit;
};

export const limits: readonly NamedLimit[] = [
  { label: "15 seconds", limit: limit_15_seconds },
  { label: "30 seconds", limit: limit_30_seconds },
  { label: "one minute", limit: limit_60_seconds },
  { label: "100 chars", limit: limit_100_chars },
  { label: "500 chars", limit: limit_500_chars },
  { label: "1000 chars", limit: limit_1000_chars },
];

export function computeProgress(
  steps: readonly Step[],
  limit: Limit,
): [progress: Progress, completed: boolean] {
  const { length } = steps;
  let time = 0;
  let progress = 0;
  let completed = false;
  if (length > 0) {
    const first = steps[0];
    const last = steps[length - 1];
    time = last.timeStamp - first.timeStamp;
    switch (limit.type) {
      case "time": {
        progress = time / limit.time;
        completed = time >= limit.time;
        break;
      }
      case "length": {
        progress = length / limit.length;
        completed = length >= limit.length;
        break;
      }
    }
  }
  return [{ time, length, progress }, completed];
}
