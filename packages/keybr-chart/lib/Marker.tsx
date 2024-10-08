import { type ReactNode } from "react";
import * as styles from "./Marker.module.less";

type Props = {
  readonly type:
    | "slow"
    | "fast"
    | "speed"
    | "accuracy"
    | "complexity"
    | "threshold"
    | "histogram-h"
    | "histogram-m"
    | "histogram-r";
};

export function Marker({ type }: Props): ReactNode {
  let cn;
  switch (type) {
    case "slow":
      cn = styles.slow;
      break;
    case "fast":
      cn = styles.fast;
      break;
    case "speed":
      cn = styles.speed;
      break;
    case "accuracy":
      cn = styles.accuracy;
      break;
    case "complexity":
      cn = styles.complexity;
      break;
    case "threshold":
      cn = styles.threshold;
      break;
    case "histogram-h":
      cn = styles.histogram_h;
      break;
    case "histogram-m":
      cn = styles.histogram_m;
      break;
    case "histogram-r":
      cn = styles.histogram_r;
      break;
  }
  return <span className={cn}>{"\u00A0"}</span>;
}
