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
      cn = styles.legend_slow;
      break;
    case "fast":
      cn = styles.legend_fast;
      break;
    case "speed":
      cn = styles.legend_speed;
      break;
    case "accuracy":
      cn = styles.legend_accuracy;
      break;
    case "complexity":
      cn = styles.legend_complexity;
      break;
    case "threshold":
      cn = styles.legend_threshold;
      break;
    case "histogram-h":
      cn = styles.legend_histogram_h;
      break;
    case "histogram-m":
      cn = styles.legend_histogram_m;
      break;
    case "histogram-r":
      cn = styles.legend_histogram_r;
      break;
  }
  return <span className={cn}>{"\u00A0"}</span>;
}
