import { LessonKey, Target } from "@keybr/lesson";
import { type Letter } from "@keybr/phonetic-model";
import { type KeyStatsMap } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { type FocusProps, useHotkeysHandler } from "@keybr/widget";
import { type FocusEvent, type ReactNode } from "react";
import { Key } from "./Key.tsx";
import * as styles from "./KeySelector.module.less";

export const KeySelector = ({
  current,
  disabled,
  keyStatsMap,
  tabIndex,
  title,
  onSelect,
  onFocus,
  onBlur,
}: {
  readonly current: Letter;
  readonly keyStatsMap: KeyStatsMap;
  readonly title?: string;
  readonly onSelect?: (letter: Letter) => void;
} & FocusProps): ReactNode => {
  const { settings } = useSettings();
  const target = new Target(settings);
  const { letters } = keyStatsMap;
  const handleFocus = (ev: FocusEvent): void => {
    if (onFocus != null) {
      onFocus(ev);
    }
  };
  const handleBlur = (ev: FocusEvent): void => {
    if (onBlur != null) {
      onBlur(ev);
    }
  };
  const handlePrev = (): void => {
    if (onSelect != null) {
      const currentIndex = letters.findIndex(
        (letter) => letter.codePoint === current.codePoint,
      );
      let selectedIndex;
      if (currentIndex === -1 || currentIndex === 0) {
        selectedIndex = letters.length - 1;
      } else {
        selectedIndex = currentIndex - 1;
      }
      onSelect(letters[selectedIndex]);
    }
  };
  const handleNext = (): void => {
    if (onSelect != null) {
      const currentIndex = letters.findIndex(
        (letter) => letter.codePoint === current.codePoint,
      );
      let selectedIndex;
      if (currentIndex === -1 || currentIndex === letters.length - 1) {
        selectedIndex = 0;
      } else {
        selectedIndex = currentIndex + 1;
      }
      onSelect(letters[selectedIndex]);
    }
  };
  return (
    <span
      className={styles.root}
      tabIndex={disabled ? undefined : tabIndex ?? 0}
      title={title}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={useHotkeysHandler(
        ["ArrowLeft", handlePrev],
        ["ArrowUp", handlePrev],
        ["ArrowRight", handleNext],
        ["ArrowDown", handleNext],
      )}
    >
      {letters.map((letter) => (
        <Key
          key={letter.codePoint}
          lessonKey={LessonKey.from(
            keyStatsMap.get(letter),
            target,
          ).asIncluded()}
          isSelectable={true}
          isCurrent={current.codePoint === letter.codePoint}
          onClick={() => {
            if (onSelect != null) {
              onSelect(letter);
            }
          }}
        />
      ))}
    </span>
  );
};
