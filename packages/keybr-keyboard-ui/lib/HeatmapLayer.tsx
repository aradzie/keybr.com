import {
  type HasCodePoint,
  type Keyboard,
  type KeyboardKey,
  useKeyboard,
} from "@keybr/keyboard";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import * as styles from "./HeatmapLayer.module.less";

export const HeatmapLayer = memo(function HeatmapLayer({
  histogram,
  modifier,
}: {
  readonly histogram: Iterable<[HasCodePoint, number]>;
  readonly modifier: "h" | "m" | "f";
}): ReactNode {
  const keyboard = useKeyboard();
  return (
    <svg x={21} y={21}>
      {normalize(keyboard, histogram).map(([key, frequency]) => {
        const {
          id,
          geometry: { x, y, w, h },
        } = key;
        const cx = x + w / 2;
        const cy = y + h / 2;
        switch (modifier) {
          case "h": {
            const r = frequency * 15 + 5;
            // top left ellipse
            return (
              <path
                key={id}
                className={clsx(styles.spot, styles.spot_h)}
                d={`M${cx - r},${cy + r} A${r},${r} 0 0 1 ${cx + r},${cy - r}`}
              />
            );
          }
          case "m": {
            const r = frequency * 15 + 5;
            // bottom right ellipse
            return (
              <path
                key={id}
                className={clsx(styles.spot, styles.spot_m)}
                d={`M${cx - r},${cy + r} A${r},${r} 0 0 0 ${cx + r},${cy - r}`}
              />
            );
          }
          case "f": {
            const r = frequency * 20 + 5;
            // just circle
            return (
              <circle
                key={id}
                className={clsx(styles.spot, styles.spot_f)}
                cx={cx}
                cy={cy}
                r={r}
              />
            );
          }
        }
      })}
    </svg>
  );
});

function normalize(
  keyboard: Keyboard,
  histogram: Iterable<[HasCodePoint, number]>,
): [KeyboardKey, number][] {
  const map = new Map<KeyboardKey, number>();
  for (const [{ codePoint }, count] of histogram) {
    if (count > 0) {
      const keyCombo = keyboard.getKeyCombo(codePoint);
      if (keyCombo != null && keyCombo.prefix == null) {
        map.set(keyCombo.key, count);
      }
    }
  }
  if (map.size > 0) {
    const min = Math.min(...map.values());
    const max = Math.max(...map.values());
    return [...map]
      .sort((a, b) => a[1] - b[1])
      .map(([key, count]) => [
        key,
        max > min ? (count - min) / (max - min) : 0.5,
      ]);
  } else {
    return [];
  }
}
