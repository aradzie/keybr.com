import { type ReactNode, useState } from "react";
import * as styles from "./Group.module.less";

export function Group({
  children,
  title,
}: {
  readonly children: ReactNode;
  readonly title: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <fieldset className={styles.root}>
      <legend
        className={styles.legend}
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {visible ? "\u25BC" : "\u25BA"} {title}
      </legend>
      {visible && children}
    </fieldset>
  );
}
