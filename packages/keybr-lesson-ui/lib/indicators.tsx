import {
  type DailyGoal as DailyGoalType,
  type LessonKeys,
} from "@keybr/lesson";
import {
  type StreakList as StreakListType,
  type SummaryStats,
} from "@keybr/result";
import { Name } from "@keybr/widget";
import { memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { CurrentKey } from "./CurrentKey.tsx";
import { DailyGoal } from "./DailyGoal.tsx";
import { GaugeList } from "./gauges.tsx";
import * as styles from "./indicators.module.less";
import { KeySet } from "./KeySet.tsx";
import { type Names } from "./names.ts";
import { StreakList } from "./StreakList.tsx";

export const GaugeRow = memo(function GaugeRow({
  summaryStats,
  names,
}: {
  readonly summaryStats: SummaryStats;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.gaugesPanel.label",
          defaultMessage: "Metrics",
        })}
      />
      <GaugeList summaryStats={summaryStats} names={names} />
    </div>
  );
});

export const KeySetRow = memo(function KeySetRow({
  lessonKeys,
  names,
}: {
  readonly lessonKeys: LessonKeys;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.keySetPanel.label",
          defaultMessage: "All keys",
        })}
      />
      <KeySet
        id={names?.keySet}
        className={styles.value}
        lessonKeys={lessonKeys}
      />
    </div>
  );
});

export const CurrentKeyRow = memo(function CurrentKeyRow({
  lessonKeys,
  names,
}: {
  readonly lessonKeys: LessonKeys;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.currentKeyPanel.label",
          defaultMessage: "Current key",
        })}
      />
      <CurrentKey
        id={names?.currentKey}
        className={styles.value}
        lessonKeys={lessonKeys}
      />
    </div>
  );
});

export const StreakListRow = memo(function StreakListRow({
  streakList,
  names,
}: {
  readonly streakList: StreakListType;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.row}>
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.streakListPanel.label",
          defaultMessage: "Accuracy",
        })}
      />
      <StreakList
        id={names?.streakList}
        className={styles.value}
        streakList={streakList}
      />
    </div>
  );
});

export const DailyGoalRow = memo(function DailyGoalRow({
  dailyGoal,
  names,
}: {
  readonly dailyGoal: DailyGoalType;
  readonly names?: Names;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div
      className={styles.row}
      title={formatMessage({
        id: "lesson.dailyGoalPanel.description",
        defaultMessage: "The progress to your daily goal.",
      })}
    >
      <Name
        className={styles.name}
        name={formatMessage({
          id: "lesson.dailyGoalPanel.label",
          defaultMessage: "Daily goal",
        })}
      />
      <DailyGoal
        id={names?.dailyGoal}
        className={styles.value}
        dailyGoal={dailyGoal}
      />
    </div>
  );
});
