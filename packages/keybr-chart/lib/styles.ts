import { useTheme } from "@keybr/themes";
import { calcLineHeight, calcStyle, useDynamicStyles } from "@keybr/widget";
import { useMemo } from "react";
import * as styles from "./styles.module.less";

export type Styles = ReturnType<typeof useStyles>;

export function useStyles() {
  const { color, font } = useTheme();
  const { getStyledElement } = useDynamicStyles();
  const element = getStyledElement();
  return useMemo(() => {
    use(color, font);
    return {
      frame: calcStyle([styles.frame], element),
      headerText: calcStyle([styles.headerText], element),
      subheaderText: calcStyle([styles.subheaderText], element),
      keyLabel: calcStyle([styles.value, styles.keyFont], element),
      value: calcStyle([styles.value], element),
      valueLabel: calcStyle([styles.value, styles.valueFont], element),
      threshold: calcStyle([styles.threshold], element),
      thresholdLabel: calcStyle([styles.threshold, styles.valueFont], element),
      complexity: calcStyle([styles.complexity], element),
      accuracy: calcStyle([styles.accuracy], element),
      speed: calcStyle([styles.speed], element),
      histHit: calcStyle([styles.hist_h], element),
      histMiss: calcStyle([styles.hist_m], element),
      histRatio: calcStyle([styles.hist_r], element),
      lineHeight: calcLineHeight(null, element),
    };
  }, [color, font, element]);
}

function use(...arg: any) {}
