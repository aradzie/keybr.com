import { clsx } from "clsx";
import * as styles from "./Meter.module.less";

export function Meter({
  length,
  slideIndex,
}: {
  readonly length: number;
  readonly slideIndex: number;
}) {
  return (
    <div className={styles.root}>
      {new Array(length).fill(null).map((slide, index) => (
        <span
          key={index}
          className={clsx(styles.item, slideIndex === index && styles.current)}
        />
      ))}
    </div>
  );
}
