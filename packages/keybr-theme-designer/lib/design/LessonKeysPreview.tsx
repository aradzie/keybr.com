import { LessonKey } from "@keybr/lesson";
import { Key } from "@keybr/lesson-ui";
import { Letter } from "@keybr/phonetic-model";
import { Box } from "@keybr/widget";

export function LessonKeysPreview() {
  return (
    <Box alignItems="center" justifyContent="center">
      {[
        ...[1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0],
        ...[null, null, null],
      ].map((value, index) => (
        <Key
          key={index}
          lessonKey={
            new LessonKey({
              letter: new Letter(/* "a" */ 0x0061 + index, 1),
              samples: [],
              timeToType: 380,
              bestTimeToType: 380,
              confidence: value,
              bestConfidence: value,
              isIncluded: true,
              isFocused: value === 0.0,
              isForced: false,
            })
          }
        />
      ))}
    </Box>
  );
}
