import { type KeyShape, type Ngram2, useKeyboard } from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { memo, type ReactNode } from "react";
import { frameWidth, keyGap, keySize } from "./constants.ts";
import * as styles from "./TransitionsLayer.module.less";

export const TransitionsLayer = memo(function TransitionsLayer({
  ngram,
}: {
  readonly ngram: Ngram2;
}): ReactNode {
  const keyboard = useKeyboard();
  const bigrams = [...ngram]
    .filter(({ a, b, f }) => a !== 0x0020 && b !== 0x0020 && f > 0)
    .sort((a, b) => b.f - a.f)
    .slice(0, 100)
    .reverse();
  const fa = bigrams.map(({ f }) => f);
  const min = Math.min(...fa);
  const max = Math.max(...fa);
  return (
    <svg x={frameWidth} y={frameWidth}>
      <defs>
        <marker
          id={styles.marker}
          markerWidth="5"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path className={styles.arrowMarker} d="M 0 0 L 0 6 L 5 3 z" />
        </marker>
      </defs>
      {...bigrams.map(({ a, b, f }) => {
        const s1 = getShape(a);
        const s2 = getShape(b);
        return s1 != null && s2 != null
          ? arrow(s1, s2, max > min ? (f - min) / (max - min) : 0.5)
          : null;
      })}
    </svg>
  );

  function getShape(codePoint: CodePoint): KeyShape | null {
    const combo = keyboard.getCombo(codePoint);
    if (combo != null) {
      const shape = keyboard.getShape(combo.id);
      if (shape != null) {
        return shape;
      }
    }
    return null;
  }
});

function arrow(s1: KeyShape, s2: KeyShape, f: number): ReactNode {
  if (s1 === s2) {
    return null;
  }

  const x1 = s1.x * keySize + (s1.w * (keySize - keyGap)) / 2;
  const y1 = s1.y * keySize + (s1.h * (keySize - keyGap)) / 2;

  const x2 = s2.x * keySize + (s2.w * (keySize - keyGap)) / 2;
  const y2 = s2.y * keySize + (s2.h * (keySize - keyGap)) / 2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  const theta = Math.atan2(dy, dx);

  const l = Math.sqrt(dx * dx + dy * dy);

  const ox = -(y2 - y1) / l;
  const oy = (x2 - x1) / l;

  const mx = x1 + (x2 - x1) / 2 + (ox * l) / 4;
  const my = y1 + (y2 - y1) / 2 + (oy * l) / 4;

  const t = 3;
  const X1 = x1 + Math.cos(theta) * t;
  const Y1 = y1 + Math.sin(theta) * t;
  const X2 = x2 - Math.cos(theta) * t;
  const Y2 = y2 - Math.sin(theta) * t;

  return (
    <path
      className={styles.arrowPath}
      d={`M ${X1} ${Y1} Q ${mx} ${my} ${X2} ${Y2}`}
      opacity={f * 0.9 + 0.1}
      markerEnd={`url(#${styles.marker})`}
    />
  );
}
