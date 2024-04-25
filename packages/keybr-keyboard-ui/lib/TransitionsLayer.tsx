import { type KeyShape, useKeyboard } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { frameWidth, keyGap, keySize } from "./constants.ts";
import * as styles from "./TransitionsLayer.module.less";

export const TransitionsLayer = memo(function TransitionsLayer({
  histogram,
  modifier,
}: {
  readonly histogram: Iterable<readonly [CodePoint, CodePoint, number]>;
  readonly modifier: "h" | "m" | "f";
}): ReactNode {
  type Item = [shape0: KeyShape, shape1: KeyShape, f: number];
  const keyboard = useKeyboard();
  return (
    <svg x={frameWidth} y={frameWidth}>
      <defs>
        <marker
          id={styles.arrow}
          markerWidth="5"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            className={styles.arrow}
            d="M 0 0 L 0 6 L 5 3 z"
            fill="context-stroke"
            stroke="none"
          />
        </marker>
      </defs>
      {items().map(draw)}
    </svg>
  );

  function items() {
    const list: Item[] = [];
    for (const [codePoint0, codePoint1, f] of [...histogram]
      .sort((a, b) => b[2] - a[2])
      .slice(0, 100)) {
      if (f > 0) {
        const shape0 = getShape(codePoint0);
        const shape1 = getShape(codePoint1);
        if (shape0 != null && shape1 != null) {
          list.push([shape0, shape1, f]);
        }
      }
    }
    return normalize(list);
  }

  function normalize(list: Item[]) {
    const v = list.map((v) => v[2]);
    const a = Math.min(...v);
    const b = Math.max(...v);
    return list
      .map(([shape0, shape1, f]) => {
        return [shape0, shape1, b > a ? (f - a) / (b - a) : 0.5] as Item;
      })
      .sort((a, b) => a[2] - b[2]);
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

  function draw([shape0, shape1, f]: Item, index: number): ReactNode {
    if (shape0 === shape1) {
      return null;
    }
    const x1 = shape0.x * keySize + (shape0.w * (keySize - keyGap)) / 2;
    const y1 = shape0.y * keySize + (shape0.h * (keySize - keyGap)) / 2;
    const x2 = shape1.x * keySize + (shape1.w * (keySize - keyGap)) / 2;
    const y2 = shape1.y * keySize + (shape1.h * (keySize - keyGap)) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const theta = Math.atan2(dy, dx);
    const l = Math.sqrt(dx * dx + dy * dy);
    const ox = (y2 - y1) / l;
    const oy = -(x2 - x1) / l;
    const mx = x1 + (x2 - x1) / 2 + (ox * l) / 4;
    const my = y1 + (y2 - y1) / 2 + (oy * l) / 4;
    const t = 3;
    const X1 = x1 + Math.cos(theta) * t;
    const Y1 = y1 + Math.sin(theta) * t;
    const X2 = x2 - Math.cos(theta) * t;
    const Y2 = y2 - Math.sin(theta) * t;
    return (
      <path
        key={index}
        className={clsx(styles.arc, modifierStyle(modifier))}
        d={`M ${X1} ${Y1} Q ${mx} ${my} ${X2} ${Y2}`}
        opacity={f * 0.9 + 0.1}
        markerEnd={`url(#${styles.arrow})`}
      />
    );
  }
});

function modifierStyle(m: "h" | "m" | "f") {
  switch (m) {
    case "h":
      return styles.h;
    case "m":
      return styles.m;
    case "f":
      return styles.f;
    default:
      return null;
  }
}
