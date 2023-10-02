import { type LessonKey } from "@keybr/lesson";
import {
  CurrentKeyRow,
  DailyGoalRow,
  GaugeRow,
  Key,
  KeySetRow,
} from "@keybr/lesson-ui";
import {
  computeDailyGoal,
  type DailyGoal,
  LocalDate,
  newSummaryStats,
  ResultGroups,
  type SummaryStats,
} from "@keybr/result";
import { Popup, Portal } from "@keybr/widget";
import {
  memo,
  type MouseEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import * as styles from "./Indicators.module.less";
import { KeyExtendedDetails } from "./KeyExtendedDetails.tsx";
import * as names from "./names.module.less";
import { type PracticeState } from "./practicestate.ts";

export const Indicators = memo(function Indicators({
  state,
}: {
  readonly state: PracticeState;
}): ReactNode {
  const summaryStats = useSummaryStats(state);
  const dailyGoal = useDailyGoal(state);
  const [selectedKey, setSelectedKey] = useState<LessonKey | null>(null);
  const { lessonKeys } = state;
  const onMouseMove = (ev: MouseEvent): void => {
    const codePoint = Key.isKey(ev.target);
    if (codePoint) {
      setSelectedKey(lessonKeys.find(codePoint));
    } else {
      setSelectedKey(null);
    }
  };
  return (
    <div
      id={names.indicators}
      className={styles.indicators}
      onMouseMove={onMouseMove}
    >
      <GaugeRow summaryStats={summaryStats} names={names} />
      <KeySetRow lessonKeys={lessonKeys} names={names} />
      <CurrentKeyRow lessonKeys={lessonKeys} names={names} />
      {dailyGoal.goal > 0 && (
        <DailyGoalRow
          value={dailyGoal.value}
          goal={dailyGoal.goal}
          names={names}
        />
      )}
      {selectedKey && (
        <Portal>
          <Popup target={Key.selector(selectedKey.letter)} position="s">
            <KeyExtendedDetails
              lessonKey={selectedKey}
              keyStats={state.keyStatsMap.get(selectedKey.letter)}
            />
          </Popup>
        </Portal>
      )}
    </div>
  );
});

function useSummaryStats(state: PracticeState): SummaryStats {
  return useMemo(() => {
    return newSummaryStats(state.results);
  }, [state]);
}

function useDailyGoal(state: PracticeState): DailyGoal {
  return useMemo(() => {
    const today = ResultGroups.byDate(state.results).get(LocalDate.now());
    return computeDailyGoal(today, state.settings.dailyGoal);
  }, [state]);
}
