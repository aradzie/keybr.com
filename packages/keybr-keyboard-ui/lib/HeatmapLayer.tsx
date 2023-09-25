import { useKeyboard } from "@keybr/keyboard";
import { type Letter } from "@keybr/phonetic-model";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import * as styles from "./HeatmapLayer.module.less";
import { keyFrequencies } from "./util.ts";

export const HeatmapLayer = memo(function HeatmapLayer({
  histogram,
  modifier,
}: {
  readonly histogram: ReadonlyMap<Letter, number>;
  readonly modifier: "h" | "m" | "f";
}): ReactNode {
  const keyboard = useKeyboard();
  return (
    <svg x={21} y={21}>
      {keyFrequencies(keyboard, histogram).map(([key, frequency]) => {
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
