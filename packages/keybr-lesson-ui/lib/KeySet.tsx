import { type LessonKeys } from "@keybr/lesson";
import { type ClassName } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { Key } from "./Key.tsx";
import * as styles from "./KeySet.module.less";

export const KeySet = ({
  id,
  className,
  lessonKeys,
}: {
  readonly id?: string;
  readonly className?: ClassName;
  readonly lessonKeys: LessonKeys;
}): ReactNode => {
  return (
    <span id={id} className={clsx(styles.keySet, className)}>
      {[...lessonKeys].map((lessonKey) => (
        <Key key={lessonKey.letter.codePoint} lessonKey={lessonKey} />
      ))}
    </span>
  );
};
