import { KeyDetailsChart } from "@keybr/chart";
import { LearningRate, type LessonKey, Target } from "@keybr/lesson";
import { Key, KeyDetails } from "@keybr/lesson-ui";
import { type KeyStats } from "@keybr/result";
import { useSettings } from "@keybr/settings";
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
  const { settings } = useSettings();
  const target = new Target(settings);
  const learningRate = LearningRate.from(keyStats.samples, target);
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
