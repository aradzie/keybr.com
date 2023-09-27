import { KeyDetailsChart } from "@keybr/chart";
import type { LessonKey } from "@keybr/lesson";
import { LearningRate } from "@keybr/lesson";
import { Key, KeyDetails } from "@keybr/lesson-ui";
import { type KeyStats } from "@keybr/result";
import { type ReactNode } from "react";
import * as styles from "./KeyExtendedDetails.module.less";
import { LearningRateDescription } from "./LearningRateDescription.tsx";

export function KeyExtendedDetails({
  lessonKey,
  keyStats,
}: {
  readonly lessonKey: LessonKey;
  readonly keyStats: KeyStats;
}): ReactNode {
  const learningRate = LearningRate.from(keyStats.samples);
  return (
    <div className={styles.component}>
      <div className={styles.keyDetails}>
        <Key lessonKey={lessonKey} size="large" />
        <KeyDetails lessonKey={lessonKey} />
      </div>
      <LearningRateDescription
        lessonKey={lessonKey}
        learningRate={learningRate}
      />
      <KeyDetailsChart
        lessonKey={lessonKey}
        learningRate={learningRate}
        width="50rem"
        height="15rem"
      />
    </div>
  );
}
