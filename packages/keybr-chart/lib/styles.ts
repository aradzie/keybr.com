import { calcLineHeight, calcStyle } from "@keybr/widget";
import * as styles from "./styles.module.less";

export const chartStyles = {
  headerText: calcStyle([styles.headerText]),
  subheaderText: calcStyle([styles.subheaderText]),
  normalText: calcStyle([styles.normalText]),
  frame: calcStyle([styles.frame]),
  lighterFrame: calcStyle([styles.frame, styles.lighterFrame]),
  keyLabel: calcStyle([styles.keyLabel]),
  valueLabel: calcStyle([styles.valueLabel]),
  threshold: calcStyle([styles.threshold]),
  thresholdLabel: calcStyle([styles.threshold, styles.valueLabel]),
  complexity: calcStyle([styles.complexity]),
  accuracy: calcStyle([styles.accuracy]),
  speed: calcStyle([styles.speed]),
  histHit: calcStyle([styles.hist_h]),
  histMiss: calcStyle([styles.hist_m]),
  histRatio: calcStyle([styles.hist_r]),
  lineHeight: calcLineHeight(null),
};
