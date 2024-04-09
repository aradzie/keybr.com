import { KeyDetailsChart } from "@keybr/chart";
import { LearningRate, LessonKey, lessonProps, Target } from "@keybr/lesson";
import { Letter } from "@keybr/phonetic-model";
import { Settings } from "@keybr/settings";
import { type ReactNode } from "react";
import * as styles from "./KeyDetailsChartDemo.module.less";

export function KeyDetailsChartDemo(): ReactNode {
  const settings = new Settings().set(lessonProps.targetSpeed, /* 35WPM */ 175);
  const target = new Target(settings);
  const lessonKey = new LessonKey({
    letter: new Letter(/* a */ 0x0061, 1, "A"),
    samples: [],
    timeToType: 380,
    bestTimeToType: 380,
    confidence: target.confidence(380),
    bestConfidence: target.confidence(380),
  });
  const learningRate = LearningRate.example(target);
  return (
    <div className={styles.component}>
      <KeyDetailsChart
        lessonKey={lessonKey}
        learningRate={learningRate}
        width="36rem"
        height="15rem"
      />
    </div>
  );
}
