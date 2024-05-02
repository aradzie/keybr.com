import {
  isDiacritic,
  KeyCharacters,
  type KeyShape,
  type LabelShape,
  type Language,
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

export function makeKeyComponent(
  { letterName }: Language,
  shape: KeyShape,
): FunctionComponent<KeyProps> {
  const { isCodePoint } = KeyCharacters;
  const { id, a, b, c, d } = shape;
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
  const ta = isCodePoint(a);
  const tb = isCodePoint(b);
  const tc = isCodePoint(c);
  const td = isCodePoint(d);
  const ab = ta && tb && letterName(a) === letterName(b);
  const cd = tc && td && letterName(c) === letterName(d);
  if (ta && !ab) {
    children.push(makeCodePointLabel(a, 10, 27, styles.secondarySymbol));
  }
  if (tb && !ab) {
    children.push(makeCodePointLabel(b, 10, 12, styles.secondarySymbol));
  }
  if (tc && !cd) {
    children.push(makeCodePointLabel(c, 25, 27, styles.secondarySymbol));
  }
  if (td && !cd) {
    children.push(makeCodePointLabel(d, 25, 12, styles.secondarySymbol));
  }
  if (ta && ab) {
    children.push(makeCodePointLabel(a, 10, 12, styles.primarySymbol));
  }
  if (tc && cd) {
    children.push(makeCodePointLabel(c, 25, 27, styles.primarySymbol));
  }
  const zoneClassName = zoneClassNameOf(shape);
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
          showColors && zoneClassName,
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

  function makeCodePointLabel(
    codePoint: CodePoint,
    x: number,
    y: number,
    className: ClassName,
  ): ReactNode {
    switch (codePoint) {
      case /* Space */ 0x0020:
      case /* No-Break Space */ 0x00a0:
      case /* Narrow No-Break Space */ 0x202f:
        return null;
      case /* Zero Width Non-Joiner */ 0x200c:
      case /* Zero Width Joiner */ 0x200d:
      case /* Left-To-Right Mark */ 0x200e:
      case /* Right-To-Left Mark */ 0x200f:
      case /* Combining Grapheme Joiner */ 0x034f:
        return null;
    }
    return makeLabel(
      {
        text: letterName(codePoint),
        pos: [x, y],
        align: ["m", "m"],
      },
      clsx(className, isDiacritic(codePoint) && styles.deadSymbol),
    );
  }
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

function zoneClassNameOf(shape: KeyShape): string | null {
  return clsx(handClassNameOf(shape), fingerClassNameOf(shape));
}

function handClassNameOf({ hand }: KeyShape): string | null {
  switch (hand) {
    case "left":
      return styles.handLeft;
    case "right":
      return styles.handRight;
  }
  return null;
}

function fingerClassNameOf({ finger }: KeyShape): string | null {
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
