import {
  type FingerId,
  isDiacritic,
  type KeyShape,
  type LabelShape,
} from "@keybr/keyboard";
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
  const children: ReactNode[] = [];
  children.push(
    shape.shape ? (
      <path className={styles.button} d={shape.shape} />
    ) : (
      <rect
        className={styles.button}
        x={0}
        y={0}
        width={shape.w * keySize - keyGap}
        height={shape.h * keySize - keyGap}
      />
    ),
  );
  const { a, b, c, d } = shape;
  const ab = a > 0 && b > 0 && keySymbol(a) === keySymbol(b);
  const cd = c > 0 && d > 0 && keySymbol(c) === keySymbol(d);
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
  for (const label of shape.labels) {
    children.push(makeLabel(label));
  }
  if (shape.homing) {
    children.push(<circle className={styles.bump} cx={20} cy={33} r={3} />);
  }
  const id = shape.id;
  const x = shape.x * keySize;
  const y = shape.y * keySize;
  const w = shape.w * keySize - keyGap;
  const h = shape.h * keySize - keyGap;
  const finger = shape.finger;
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

function makeLabel(label: LabelShape, className: any = null): ReactNode {
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
  className: any,
): ReactNode {
  let text: string;
  if (isDiacritic(codePoint)) {
    text = deadKeySymbol(codePoint);
    className = clsx(styles.deadSymbol, className);
  } else {
    text = keySymbol(codePoint);
  }
  return makeLabel({ text, pos: [x, y], align: ["m", "m"] }, className);
}

function keySymbol(codePoint: number): string {
  if (codePoint === /* ß */ 0x00df || codePoint === /* ẞ */ 0x1e9e) {
    return "ẞ";
  }
  return String.fromCodePoint(codePoint).toUpperCase();
}

function deadKeySymbol(codePoint: number): string {
  return String.fromCodePoint(/* ◌ */ 0x25cc, codePoint);
}

function fingerStyleName(finger: FingerId | null): string | null {
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
