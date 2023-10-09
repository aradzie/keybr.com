import { type Step } from "@keybr/textinput";
import { type Duration, DurationType, type Progress } from "./types.ts";

export function timeDuration(time: number): Duration {
  return { type: DurationType.Time, value: time };
}

export function lengthDuration(length: number): Duration {
  return { type: DurationType.Length, value: length };
}

export const duration_15_seconds = timeDuration(15_000);
export const duration_30_seconds = timeDuration(30_000);
export const duration_60_seconds = timeDuration(60_000);
export const duration_100_chars = lengthDuration(100);
export const duration_500_chars = lengthDuration(500);
export const duration_1000_chars = lengthDuration(1000);

export type NamedDuration = {
  readonly label: string;
  readonly duration: Duration;
};

export const durations: readonly NamedDuration[] = [
  { label: "15 seconds", duration: duration_15_seconds },
  { label: "30 seconds", duration: duration_30_seconds },
  { label: "one minute", duration: duration_60_seconds },
  { label: "100 chars", duration: duration_100_chars },
  { label: "500 chars", duration: duration_500_chars },
  { label: "1000 chars", duration: duration_1000_chars },
];

export function computeProgress(
  steps: readonly Step[],
  duration: Duration,
): [progress: Progress, completed: boolean] {
  const { length } = steps;
  let time = 0;
  let progress = 0;
  let completed = false;
  if (length > 0) {
    const first = steps[0];
    const last = steps[length - 1];
    time = last.timeStamp - first.timeStamp;
    switch (duration.type) {
      case DurationType.Time: {
        progress = time / duration.value;
        completed = time >= duration.value;
        break;
      }
      case DurationType.Length: {
        progress = length / duration.value;
        completed = length >= duration.value;
        break;
      }
    }
  }
  return [{ time, length, progress }, completed];
}
