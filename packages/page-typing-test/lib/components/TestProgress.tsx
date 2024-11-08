import { useIntlNumbers } from "@keybr/intl";
import { useFormatter } from "@keybr/lesson-ui";
import { formatDuration, Value, withDeferred } from "@keybr/widget";
import { memo } from "react";
import { type Progress } from "../session/index.ts";
import * as styles from "./TestProgress.module.less";

export const TestProgress0 = memo(function TestProgress({
  progress: { length, time, progress, speed },
}: {
  readonly progress: Progress;
}) {
  const { formatInteger, formatPercents } = useIntlNumbers();
  const { formatSpeed } = useFormatter();
  return (
    <div className={styles.root}>
      <div
        className={styles.bar}
        style={{ inlineSize: `${progress * 100}%` }}
      />
      <div className={styles.info}>
        <Value value={formatDuration(time, { showMillis: true })} />
        {" / "}
        <Value value={formatInteger(length)} />
        {" / "}
        <Value
          value={formatPercents(progress, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        />
        {" / "}
        <Value value={formatSpeed(speed)} />
      </div>
    </div>
  );
});

export const TestProgress = withDeferred(TestProgress0);
