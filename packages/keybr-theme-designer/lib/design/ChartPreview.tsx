import { KeyDetailsChart } from "@keybr/chart";
import { LearningRate, LessonKey, lessonProps, Target } from "@keybr/lesson";
import { Letter } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import { Box } from "@keybr/widget";

export function ChartPreview() {
  const target = new Target(
    new Settings().set(lessonProps.targetSpeed, /* 35WPM */ 175),
  );
  return (
    <Box alignItems="center" justifyContent="center">
      <KeyDetailsChart
        lessonKey={
          new LessonKey({
            letter: new Letter(/* "a" */ 0x0061, 1, "A"),
            samples: [],
            timeToType: 380,
            bestTimeToType: 380,
            confidence: target.confidence(380),
            bestConfidence: target.confidence(380),
          })
        }
        learningRate={LearningRate.example(target)}
        width="36rem"
        height="15rem"
      />
    </Box>
  );
}
