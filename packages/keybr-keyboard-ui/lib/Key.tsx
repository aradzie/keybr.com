import {
  isDiacritic,
  type KeyShape,
  type LabelShape,
  type ZoneId,
} from "@keybr/keyboard";
import { type CodePoint } from "@keybr/unicode";
import { type ClassName } from "@keybr/widget";
import { clsx } from "clsx";
import {
  type FunctionComponent,
  memo,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { keyGap, keySize } from "./constants.ts";
import * as styles from "./Key.module.less";

export type KeyProps = {
  readonly depressed?: boolean;
  readonly toggled?: boolean;
  readonly showColors?: boolean;
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
  readonly showFingers?: boolean;
};

export function makeKeyComponent(shape: KeyShape): FunctionComponent<KeyProps> {
  const { id, a, b, c, d, finger } = shape;
  const x = shape.x * keySize;
  const y = shape.y * keySize;
  const w = shape.w * keySize - keyGap;
  const h = shape.h * keySize - keyGap;
  const children: ReactNode[] = [];
  children.push(
    shape.shape ? (
      <path className={styles.button} d={shape.shape} />
    ) : (
      <rect className={styles.button} x={0} y={0} width={w} height={h} />
    ),
  );
  if (shape.homing) {
    children.push(
      <circle className={styles.bump} cx={w / 2} cy={h - 5} r={3} />,
    );
  }
  for (const label of shape.labels) {
    children.push(makeLabel(label));
  }
  const ab = a > 0 && b > 0 && symbolText(a) === symbolText(b);
  const cd = c > 0 && d > 0 && symbolText(c) === symbolText(d);
  if (a > 0 && !ab) {
    children.push(makeSymbolLabel(a, 10, 27, styles.secondarySymbol));
  }
  if (b > 0 && !ab) {
    children.push(makeSymbolLabel(b, 10, 12, styles.secondarySymbol));
  }
  if (c > 0 && !cd) {
    children.push(makeSymbolLabel(c, 25, 27, styles.secondarySymbol));
  }
  if (d > 0 && !cd) {
    children.push(makeSymbolLabel(d, 25, 12, styles.secondarySymbol));
  }
  if (a > 0 && ab) {
    children.push(makeSymbolLabel(a, 10, 12, styles.primarySymbol));
  }
  if (c > 0 && cd) {
    children.push(makeSymbolLabel(c, 25, 27, styles.primarySymbol));
  }
  function KeyComponent({
    depressed,
    toggled,
    showColors,
    onClick,
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
    onMouseUp,
  }: KeyProps): ReactNode {
    return (
      <svg
        className={clsx(
          styles.key,
          depressed && styles.depressedKey,
          toggled && styles.toggledKey,
          showColors && fingerStyleName(finger),
        )}
        x={x}
        y={y}
        width={w}
        height={h}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        {...{ "data-key": id }}
      >
        {...children}
      </svg>
    );
  }
  KeyComponent.displayName = `Key[${id}]`;
  return memo(KeyComponent);
}

function makeLabel(label: LabelShape, className: ClassName = null): ReactNode {
  const { text, pos = [10, 20], align = ["s", "m"] } = label;
  const [x, y] = pos;
  const [ha, va] = align;
  let textAnchor;
  switch (ha) {
    case "s":
      textAnchor = "start";
      break;
    case "m":
      textAnchor = "middle";
      break;
    case "e":
      textAnchor = "end";
      break;
  }
  let dominantBaseline;
  switch (va) {
    case "b":
      dominantBaseline = "text-after-edge";
      break;
    case "m":
      dominantBaseline = "middle";
      break;
    case "t":
      dominantBaseline = "text-before-edge";
      break;
  }
  return (
    <text
      className={clsx(styles.symbol, className)}
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline={dominantBaseline}
      direction="ltr"
    >
      {text}
    </text>
  );
}

function makeSymbolLabel(
  codePoint: number,
  x: number,
  y: number,
  className: ClassName,
): ReactNode {
  if (codePoint === 0x0020) {
    return null;
  }
  let text: string;
  if (isDiacritic(codePoint)) {
    text = String.fromCodePoint(/* ◌ */ 0x25cc, codePoint);
    className = clsx(className, styles.deadSymbol);
  } else {
    text = symbolText(codePoint);
  }
  return makeLabel({ text, pos: [x, y], align: ["m", "m"] }, className);
}

function symbolText(codePoint: CodePoint): string {
  if (codePoint === /* ß */ 0x00df || codePoint === /* ẞ */ 0x1e9e) {
    return "ẞ";
  }
  return String.fromCodePoint(codePoint).toUpperCase();
}

function fingerStyleName(finger: ZoneId | null): string | null {
  switch (finger) {
    case "pinky":
      return styles.fingerPinky;
    case "ring":
      return styles.fingerRing;
    case "middle":
      return styles.fingerMiddle;
    case "indexLeft":
      return styles.fingerIndexLeft;
    case "indexRight":
      return styles.fingerIndexRight;
    case "thumb":
      return styles.fingerThumb;
    default:
      return null;
  }
}
