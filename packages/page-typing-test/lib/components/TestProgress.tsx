import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { formatDuration, Para, Value, withDeferred } from "@keybr/widget";
import { memo } from "react";
import { type Progress } from "../session/index.ts";
import * as styles from "./TestProgress.module.less";

export const TestProgress0 = memo(function TestProgress({
  progress: { length, time, progress, speed },
}: {
  readonly progress: Progress;
}) {
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  return (
    <Para className={styles.root}>
      <div
        className={styles.bar}
        style={{ inlineSize: `${Math.floor(progress * 100)}%` }}
      />
      <div className={styles.info}>
        <Value value={formatDuration(time, { showMillis: true })} />
        {" / "}
        <Value value={formatNumber(length)} />
        {" / "}
        <Value value={formatPercents(progress)} />
        {" / "}
        <Value value={formatSpeed(speed)} />
      </div>
    </Para>
  );
});

export const TestProgress = withDeferred(TestProgress0);
