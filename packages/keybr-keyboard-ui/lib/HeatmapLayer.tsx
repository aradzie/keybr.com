import { type KeyShape, useKeyboard } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import * as styles from "./HeatmapLayer.module.less";
import { getKeyCenter, Surface } from "./shapes.tsx";

export const HeatmapLayer = memo(function HeatmapLayer({
  histogram,
  modifier,
}: {
  readonly histogram: Iterable<readonly [codePoint: CodePoint, f: number]>;
  readonly modifier: "h" | "m" | "f";
}): ReactNode {
  type Item = [shape: KeyShape, f: number];
  const keyboard = useKeyboard();
  return <Surface>{items().map(draw)}</Surface>;

  function items() {
    const map = new Map<KeyShape, number>();
    for (const [codePoint, f] of histogram) {
      if (f > 0) {
        const shape = getShape(codePoint);
        if (shape != null) {
          map.set(shape, (map.get(shape) ?? 0) + f);
        }
      }
    }
    return normalize([...map]);
  }

  function normalize(list: Item[]) {
    const v = list.map((v) => v[1]);
    const a = Math.min(...v);
    const b = Math.max(...v);
    return list
      .map(([shape, f]) => {
        return [shape, b > a ? (f - a) / (b - a) : 0.5] as Item;
      })
      .sort((a, b) => a[1] - b[1]);
  }

  function getShape(codePoint: CodePoint): KeyShape | null {
    if (codePoint !== 0x0020) {
      const combo = keyboard.getCombo(codePoint);
      if (combo != null) {
        const shape = keyboard.getShape(combo.id);
        if (shape != null) {
          return shape;
        }
      }
    }
    return null;
  }

  function draw([shape, f]: Item, index: number): ReactNode {
    const { x, y } = getKeyCenter(shape);
    switch (modifier) {
      case "h": {
        // Top left semicircle.
        const r = f * 15 + 5;
        return (
          <path
            key={index}
            className={clsx(styles.spot, styles.spot_h)}
            d={`M ${x - r} ${y + r} A${r} ${r} 0 0 1 ${x + r} ${y - r}`}
          />
        );
      }
      case "m": {
        // Bottom right semicircle.
        const r = f * 15 + 5;
        return (
          <path
            key={index}
            className={clsx(styles.spot, styles.spot_m)}
            d={`M ${x - r} ${y + r} A ${r} ${r} 0 0 0 ${x + r} ${y - r}`}
          />
        );
      }
      case "f": {
        // Full circle.
        const r = f * 20 + 5;
        return (
          <circle
            key={index}
            className={clsx(styles.spot, styles.spot_f)}
            cx={x}
            cy={y}
            r={r}
          />
        );
      }
    }
  }
});

export function* flatten(
  histogram: Iterable<readonly [{ readonly codePoint: CodePoint }, number]>,
): IterableIterator<[CodePoint, number]> {
  for (const [{ codePoint }, f] of histogram) {
    yield [codePoint, f];
  }
}
