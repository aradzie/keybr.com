import { LessonKey, LessonKeys, MAX_TIME, MIN_TIME } from "@keybr/lesson";
import { Letter } from "@keybr/phonetic-model";
import { letters } from "./english.ts";

export function makeExampleLesson(
  confidences: readonly (number | null)[],
): LessonKeys {
  const keys: LessonKey[] = [];

  let index = 0;
  for (const letter of Letter.frequencyOrder(letters)) {
    if (index < confidences.length) {
      const confidence = confidences[index];
      const t = confidenceToTime(confidence);
      keys.push(
        new LessonKey({
          letter,
          timeToType: t,
          bestTimeToType: t,
        }).asIncluded(),
      );
    } else {
      keys.push(
        new LessonKey({
          letter,
          timeToType: NaN,
          bestTimeToType: NaN,
        }).asExcluded(),
      );
    }
    index += 1;
  }

  const lessonKeys = new LessonKeys(keys);

  // Find the least confident of all included keys and boost it.
  const boostedKey = LessonKey.findBoosted(lessonKeys.findIncludedKeys());
  if (boostedKey != null) {
    lessonKeys.boost(boostedKey.letter);
  }

  return lessonKeys;
}

function confidenceToTime(confidence: number | null): number {
  if (confidence != null) {
    return MIN_TIME + (1 - confidence) * (MAX_TIME - MIN_TIME);
  } else {
    return NaN;
  }
}
