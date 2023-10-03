import { KeyDetailsChart } from "@keybr/chart";
import { LearningRate, LessonKey, Target } from "@keybr/lesson";
import { Letter } from "@keybr/phonetic-model";
import { type ReactNode } from "react";
import * as styles from "./KeyDetailsChartDemo.module.less";

export function KeyDetailsChartDemo(): ReactNode {
  const target = new Target({ targetSpeed: /* 35WPM */ 175 });
  const lessonKey = new LessonKey({
    letter: new Letter(/* a */ 0x61, 1),
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
