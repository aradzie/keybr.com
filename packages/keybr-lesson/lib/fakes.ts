import { type Letter } from "@keybr/phonetic-model";
import {
  type KeySample,
  type KeyStats,
  type KeyStatsMap,
  speedToTime,
} from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { type LessonKeys } from "./key.ts";
import { Target } from "./target.ts";

const defaultSampleCount = 5;

export function fakeKeyStatsMap(
  settings: Settings,
  items: [
    letter: Letter,
    confidence: number | null,
    bestConfidence: number | null,
    sampleCount?: number,
  ][],
): KeyStatsMap {
  const target = new Target(settings);
  const map = new Map<Letter, KeyStats>(
    items.map(([letter, confidence, bestConfidence, sampleCount]) => {
      const timeToType =
        confidence == null
          ? null
          : speedToTime(target.targetSpeed) / confidence;
      const bestTimeToType =
        bestConfidence == null
          ? null
          : speedToTime(target.targetSpeed) / bestConfidence;
      const count =
        confidence == null && bestConfidence == null
          ? 0
          : (sampleCount ?? defaultSampleCount);
      const samples: KeySample[] = Array.from(
        { length: count },
        (_, index) => ({
          index,
          timeStamp: 0,
          hitCount: 1,
          missCount: 0,
          timeToType: timeToType ?? 0,
          filteredTimeToType: timeToType ?? 0,
        }),
      );
      return [
        letter,
        {
          letter,
          samples,
          timeToType,
          bestTimeToType,
        } as KeyStats,
      ];
    }),
  );
  // A real KeyStatsMap.results grows by one per round; GuidedLesson.update()
  // memoizes on it (plus identity of the last entry) to make its two
  // same-round call sites idempotent. Synthesize one placeholder entry per
  // sample so that varying sample counts across simulated rounds is seen
  // as new evidence, while passing the exact same fakeKeyStatsMap() result
  // to update() twice (same array, same last entry) is seen as a repeat.
  const totalSamples = [...map.values()].reduce(
    (sum, keyStats) => sum + keyStats.samples.length,
    0,
  );
  const results = Array.from({ length: totalSamples }, () => ({}));
  return {
    letters: [...map.keys()],
    results,
    get: (letter) => map.get(letter),
    [Symbol.iterator]: () => map.values(),
  } as KeyStatsMap;
}

export function printLessonKeys(lessonKeys: LessonKeys) {
  return [...lessonKeys]
    .filter((key) => key.isIncluded || key.isSecondFocused)
    .map((key) => {
      let s = `${key.letter}`;
      if (key.isForced) {
        s = `!${s}`;
      }
      if (key.isFocused) {
        s = `[${s}]`;
      }
      if (key.isSecondFocused) {
        s = `(${s})`;
      }
      return s;
    })
    .join("");
}
