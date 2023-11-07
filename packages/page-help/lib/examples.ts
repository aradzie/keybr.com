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
          timeToType: null,
          bestTimeToType: null,
          confidence: confidence,
          bestConfidence: confidence,
        }).asIncluded(),
      );
    } else {
      keys.push(
        new LessonKey({
          letter,
          samples: [],
          timeToType: null,
          bestTimeToType: null,
          confidence: null,
          bestConfidence: null,
        }).asExcluded(),
      );
    }
    index += 1;
  }

  const lessonKeys = new LessonKeys(keys);

  // Find the least confident of all included keys and focus on it.
  const focusedKey = LessonKey.findFocused(lessonKeys.findIncludedKeys());
  if (focusedKey != null) {
    lessonKeys.focus(focusedKey.letter);
  }

  return lessonKeys;
}
