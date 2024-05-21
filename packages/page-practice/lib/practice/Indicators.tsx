import { type LessonKey } from "@keybr/lesson";
import {
  CurrentKeyRow,
  DailyGoalRow,
  GaugeRow,
  getKeyElementSelector,
  isKeyElement,
  KeySetRow,
  names,
  StreakListRow,
} from "@keybr/lesson-ui";
import { Popup, Portal, useMouseHover, useTimeout } from "@keybr/widget";
import { memo, type ReactNode, useState } from "react";
import * as styles from "./Indicators.module.less";
import { KeyExtendedDetails } from "./KeyExtendedDetails.tsx";
import { type LessonState } from "./state/index.ts";

export const Indicators = memo(function Indicators({
  state,
}: {
  readonly state: LessonState;
}): ReactNode {
  const selectedKey = useKeySelector(state);
  return (
    <div id={names.indicators} className={styles.indicators}>
      <GaugeRow summaryStats={state.summaryStats} names={names} />
      <KeySetRow lessonKeys={state.lessonKeys} names={names} />
      <CurrentKeyRow lessonKeys={state.lessonKeys} names={names} />
      <StreakListRow streakList={state.streakList} names={names} />
      {state.dailyGoal.goal > 0 && (
        <DailyGoalRow dailyGoal={state.dailyGoal} names={names} />
      )}
      {selectedKey && (
        <Portal>
          <Popup anchor={getKeyElementSelector(selectedKey.letter)}>
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

function useKeySelector(state: LessonState): LessonKey | null {
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
      if (Popup.isPopupElement(el)) {
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
