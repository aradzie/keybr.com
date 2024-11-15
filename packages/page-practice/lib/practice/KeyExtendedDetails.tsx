import { KeyDetailsChart } from "@keybr/chart";
import { LearningRate, type LessonKey, Target } from "@keybr/lesson";
import { Key, KeyDetails } from "@keybr/lesson-ui";
import { type KeyStats } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { Box } from "@keybr/widget";
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
    <div className={styles.root}>
      <Box alignItems="center" justifyContent="center">
        <Key lessonKey={lessonKey} size="large" />
        <KeyDetails lessonKey={lessonKey} />
      </Box>
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
