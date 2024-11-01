import { formatDuration, Value } from "@keybr/widget";
import { memo, type ReactNode } from "react";
import { type Progress, type SessionLine } from "../session/index.ts";
import * as styles from "./LineTemplate.module.less";

export const LineTemplate = memo(function LineTemplate({
  children,
  progress,
}: {
  readonly children: ReactNode;
} & SessionLine): ReactNode {
  return (
    <div className={styles.line}>
      <div className={styles.text}>{children}</div>
      <div className={styles.stats}>{progress && <Stats {...progress} />}</div>
    </div>
  );
});

function Stats({ length, time, progress }: Progress): ReactNode {
  return (
    <>
      <Value
        value={formatDuration(time, { showMillis: true })}
        title="Time passed."
      />
      {" / "}
      <Value value={`${length}`} title="Characters inputted." />
      {" / "}
      <Value value={`${Math.floor(progress * 100)}%`} title="Progress made." />
    </>
  );
}
