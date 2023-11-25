import { calcLineHeight, calcStyle } from "@keybr/widget";
import * as styles from "./styles.module.less";

export const chartStyles = {
  headerText: calcStyle([styles.headerText]),
  subheaderText: calcStyle([styles.subheaderText]),
  normalText: calcStyle([styles.normalText]),
  frameLine: calcStyle([styles.frame]),
  lighterFrameLine: calcStyle([styles.frame, styles.lighterFrame]),
  keyLabel: calcStyle([styles.keyLabel]),
  valueLabel: calcStyle([styles.valueLabel]),
  thresholdLine: calcStyle([styles.threshold]),
  thresholdLabel: calcStyle([styles.threshold, styles.valueLabel]),
  complexityLine: calcStyle([styles.complexity]),
  accuracyLine: calcStyle([styles.accuracy]),
  speedLine: calcStyle([styles.speed]),
  keySpeedBar: calcStyle([styles.keySpeed_b]),
  histHitBar: calcStyle([styles.keyFrequency_h]),
  histMissBar: calcStyle([styles.keyFrequency_m]),
  histRatioBar: calcStyle([styles.keyFrequency_r]),
  lineHeight: calcLineHeight(null),
};
