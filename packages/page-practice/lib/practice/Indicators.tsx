import { type LessonKey, lessonProps } from "@keybr/lesson";
import {
  CurrentKeyRow,
  DailyGoalRow,
  GaugeRow,
  getKeyElementSelector,
  isKeyElement,
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
import {
  isPopupElement,
  Popup,
  Portal,
  useMouseHover,
  useTimeout,
} from "@keybr/widget";
import { memo, type ReactNode, useMemo, useState } from "react";
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
  const selectedKey = useKeySelector(state);

  return (
    <div id={names.indicators} className={styles.indicators}>
      <GaugeRow summaryStats={summaryStats} names={names} />
      <KeySetRow lessonKeys={state.lessonKeys} names={names} />
      <CurrentKeyRow lessonKeys={state.lessonKeys} names={names} />
      {dailyGoal.goal > 0 && (
        <DailyGoalRow
          value={dailyGoal.value}
          goal={dailyGoal.goal}
          names={names}
        />
      )}
      {selectedKey && (
        <Portal>
          <Popup
            target={getKeyElementSelector(selectedKey.letter)}
            position="s"
          >
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
    return computeDailyGoal(today, state.settings.get(lessonProps.dailyGoal));
  }, [state]);
}

function useKeySelector(state: PracticeState): LessonKey | null {
  const [selectedKey, setSelectedKey] = useState<LessonKey | null>(null);
  const timeout = useTimeout();
  useMouseHover((el) => {
    while (el != null) {
      const codePoint = isKeyElement(el);
      if (codePoint != null) {
        timeout.cancel();
        setSelectedKey(state.lessonKeys.find(codePoint));
        return;
      }
      if (isPopupElement(el)) {
        timeout.cancel();
        return;
      }
      el = el.parentElement;
    }
    if (selectedKey != null && !timeout.pending) {
      timeout.schedule(() => {
        setSelectedKey(null);
      }, 100);
    }
  });
  return selectedKey;
}
