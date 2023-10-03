import { LessonKey, LessonKeys } from "@keybr/lesson";
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
      keys.push(
        new LessonKey({
          letter,
          samples: [],
          timeToType: NaN,
          bestTimeToType: NaN,
          confidence: confidence,
          bestConfidence: confidence,
        }).asIncluded(),
      );
    } else {
      keys.push(
        new LessonKey({
          letter,
          samples: [],
          timeToType: NaN,
          bestTimeToType: NaN,
          confidence: null,
          bestConfidence: null,
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
