import { useComputedStyles } from "@keybr/themes";
import { useMemo } from "react";
import * as styles from "./styles.module.less";

export type ChartStyles = ReturnType<typeof useChartStyles>;

export function useChartStyles() {
  const { computeStyle, computeLineHeight } = useComputedStyles();
  return useMemo(() => {
    return {
      frame: computeStyle(styles.frame),
      headerText: computeStyle(styles.headerText),
      subheaderText: computeStyle(styles.subheaderText),
      keyLabel: computeStyle(styles.value, styles.keyFont),
      value: computeStyle(styles.value),
      valueLabel: computeStyle(styles.value, styles.valueFont),
      threshold: computeStyle(styles.threshold),
      thresholdLabel: computeStyle(styles.threshold, styles.valueFont),
      complexity: computeStyle(styles.complexity),
      accuracy: computeStyle(styles.accuracy),
      speed: computeStyle(styles.speed),
      histHit: computeStyle(styles.hist_h),
      histMiss: computeStyle(styles.hist_m),
      histRatio: computeStyle(styles.hist_r),
      lineHeight: computeLineHeight(null),
    };
  }, [computeStyle, computeLineHeight]);
}
