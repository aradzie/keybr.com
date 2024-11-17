import { type Color } from "@keybr/color";
import * as styles from "./Thumb.module.less";
import { type SliderValue } from "./types.ts";

export function Thumb({
  color,
  value: { x, y },
}: {
  readonly color: Color;
  readonly value: SliderValue;
}) {
  return (
    <div
      className={styles.root}
      style={{
        left: `${x * 100}%`,
        top: `${(1 - y) * 100}%`,
        backgroundColor: String(color),
      }}
    />
  );
}
