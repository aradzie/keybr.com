import { type Result } from "@keybr/result";

export type AccuracyStreak = {
  /** Accuracy threshold. Ignore results with accuracy below this value. */
  readonly threshold: number;
  /** The results with accuracy above or equal to the threshold. */
  readonly results: readonly Result[];
  /** The number of characters in the streak. It's a sum of all result lengths. */
  readonly length: number;
};

export function accuracyStreaks(results: readonly Result[]): AccuracyStreak[] {
  const list: {
    readonly threshold: number;
    results: Result[];
    streak: AccuracyStreak;
  }[] = [1, 0.99, 0.97, 0.95].map((threshold) => ({
    threshold,
    results: [],
    streak: makeStreak([], threshold),
  }));

  for (const result of [...results, null]) {
    let prevStreak = null;
    for (const item of list) {
      if (result != null && result.accuracy >= item.threshold) {
        item.results.push(result);
      } else {
        if (item.results.length > 0) {
          const streak = makeStreak(item.results, item.threshold);
          if (
            prevStreak == null ||
            !sameResults(prevStreak.results, streak.results)
          ) {
            if (item.streak.length <= streak.length) {
              prevStreak = item.streak = streak;
            }
          }
          item.results = [];
        }
      }
    }
  }

  return list.map(({ streak }) => streak).filter((streak) => streak.length > 0);
}

function makeStreak(
  results: readonly Result[],
  threshold: number,
): AccuracyStreak {
  return {
    threshold,
    results,
    length: totalLength(results),
  };
}

function totalLength(results: readonly Result[]): number {
  let length = 0;
  for (const result of results) {
    length += result.length;
  }
  return length;
}

function sameResults(a: readonly Result[], b: readonly Result[]): boolean {
  const { length } = a;
  if (length !== b.length) {
    return false;
  }
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
