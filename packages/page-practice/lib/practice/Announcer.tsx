import { type LessonKey } from "@keybr/lesson";
import { Key } from "@keybr/lesson-ui";
import { useWindowEvent } from "@keybr/widget";
import { memo, type ReactNode, useCallback, useEffect, useState } from "react";
import * as styles from "./Announcer.module.less";
import { type PracticeState } from "./practicestate.ts";

export type Announcement = {
  readonly lessonKey: LessonKey;
};

export const Announcer = memo(function Announcer({
  state,
}: {
  readonly state: PracticeState;
}): ReactNode {
  const [current, setCurrent] = useState({ state, ann: state.announcements });
  if (current.state !== state) {
    setCurrent({ state, ann: state.announcements });
  }
  const reset = useCallback(() => {
    if (current.ann.length > 0) {
      setCurrent({ state, ann: [] });
      state.announcements.length = 0; // Show only once.
    }
  }, [state, current]);
  useDelayed(reset);
  useWindowEvent("keydown", reset);
  if (current.ann.length > 0) {
    return (
      <div className={styles.announcer}>
        {current.ann.map((ann, index) => (
          <Item key={index} ann={ann} />
        ))}
      </div>
    );
  } else {
    return null;
  }
});

function Item({ ann }: { readonly ann: Announcement }): ReactNode {
  return (
    <div className={styles.item}>
      <Key lessonKey={ann.lessonKey} size="announcement" />
    </div>
  );
}

function useDelayed(callback: () => void): void {
  useEffect(() => {
    const id = setTimeout(callback, 1500);
    return () => {
      clearTimeout(id);
    };
  }, [callback]);
}
