import { memo, type ReactNode } from "react";
import * as styles from "./Key.module.less";

export const Patterns = memo(function Patterns(): ReactNode {
  const x = "M10 0H0v10h10z";
  const a = "M-1 1l2-2M0 10L10 0M9 11l2-2";
  const b = "M11 1L9-1m1 11L0 0m1 11l-2-2";
  return (
    <>
      <pattern
        id="finger-pinky"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternPinky} d={x} />
      </pattern>
      <pattern
        id="finger-ring"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternRing} d={x} />
      </pattern>
      <pattern
        id="finger-middle"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternMiddle} d={x} />
      </pattern>
      <pattern
        id="finger-indexLeft"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternIndexLeft} d={x} />
      </pattern>
      <pattern
        id="finger-indexRight"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternIndexRight} d={x} />
      </pattern>
      <pattern
        id="finger-thumb"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternThumb} d={x} />
      </pattern>
    </>
  );
});
