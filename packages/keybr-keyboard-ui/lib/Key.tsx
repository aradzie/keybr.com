import { isDiacritic, type KeyboardKey } from "@keybr/keyboard";
import { clsx } from "clsx";
import {
  type FunctionComponent,
  memo,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import * as styles from "./Key.module.less";

export type ClassName = any;

export type KeyProps = {
  readonly depressed?: boolean;
  readonly toggled?: boolean;
  readonly keyboardKey: KeyboardKey;
  readonly showColors?: boolean;
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
  readonly showFingers?: boolean;
  readonly children?: ReactNode;
};

export const Key = memo(makeKeyComponent(/* special= */ false));
export const SpecialKey = memo(makeKeyComponent(/* special= */ true));

function makeKeyComponent(special: boolean): FunctionComponent<KeyProps> {
  return function Key(props: KeyProps): ReactNode {
    const {
      depressed,
      toggled,
      keyboardKey: { id, geometry },
      showColors,
      children,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = props;
    const cn = clsx(
      special ? styles.specialKey : styles.simpleKey,
      depressed && styles.depressedKey,
      toggled && styles.toggledKey,
      showColors && fingerStyleName(geometry.finger),
    );
    return (
      <svg
        className={cn}
        x={geometry.x}
        y={geometry.y}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        {...{ "data-key": id }}
      >
        {children}
        {toggled && <circle className={styles.toggle} cx={6} cy={35} r={4} />}
      </svg>
    );
  };
}

export type LabelProps = {
  readonly className?: ClassName;
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly textAnchor?: string;
};

export const Label = memo(function Label(props: LabelProps): ReactNode {
  const { className, x, y, text, textAnchor } = props;
  const cn = clsx(styles.symbol, className);
  return (
    <text className={cn} x={x} y={y} textAnchor={textAnchor}>
      {text}
    </text>
  );
});

export type PrimaryProps = {
  readonly className?: ClassName;
  readonly x: number;
  readonly y: number;
  readonly text?: string;
  readonly codePoint?: number;
  readonly textAnchor?: string;
};

export const Primary = memo(function Primary({
  className,
  x,
  y,
  text,
  codePoint,
  textAnchor,
}: PrimaryProps): ReactNode {
  if (codePoint != null && codePoint > 0) {
    if (isDiacritic(codePoint)) {
      text = deadKeySymbol(codePoint);
      className = [styles.deadSymbol, className];
    } else {
      text = keySymbol(codePoint);
    }
  }
  const cn = clsx(styles.symbol, styles.primarySymbol, className);
  return (
    <text className={cn} x={x} y={y} textAnchor={textAnchor}>
      {text}
    </text>
  );
});

export type SecondaryProps = {
  readonly className?: ClassName;
  readonly x: number;
  readonly y: number;
  readonly text?: string;
  readonly codePoint?: number;
  readonly textAnchor?: string;
};

export const Secondary = memo(function Secondary({
  className,
  x,
  y,
  text,
  codePoint,
  textAnchor,
}: SecondaryProps): ReactNode {
  if (codePoint != null && codePoint > 0) {
    if (isDiacritic(codePoint)) {
      text = deadKeySymbol(codePoint);
      className = [styles.deadSymbol, className];
    } else {
      text = keySymbol(codePoint);
    }
  }
  const cn = clsx(styles.symbol, styles.secondarySymbol, className);
  return (
    <text className={cn} x={x} y={y} textAnchor={textAnchor}>
      {text}
    </text>
  );
});

export const Patterns = memo(function Patterns(): ReactNode {
  const x = "M10 0H0v10h10z";
  const a = "M-1 1l2-2M0 10L10 0M9 11l2-2";
  const b = "M11 1L9-1m1 11L0 0m1 11l-2-2";
  return (
    <>
      <pattern
        id="finger-pinky"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternPinky} d={x} />
      </pattern>
      <pattern
        id="finger-ring"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternRing} d={x} />
      </pattern>
      <pattern
        id="finger-middle"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternMiddle} d={x} />
      </pattern>
      <pattern
        id="finger-indexLeft"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternIndexLeft} d={x} />
      </pattern>
      <pattern
        id="finger-indexRight"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternIndexRight} d={x} />
      </pattern>
      <pattern
        id="finger-thumb"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternThumb} d={x} />
      </pattern>
    </>
  );
});

export function keySymbol(codePoint: number): string {
  if (codePoint === /* ß */ 0x00df || codePoint === /* ẞ */ 0x1e9e) {
    return "ẞ";
  }
  return String.fromCodePoint(codePoint).toUpperCase();
}

export function deadKeySymbol(codePoint: number): string {
  return String.fromCodePoint(/* ◌ */ 0x25cc, codePoint);
}

function fingerStyleName(finger: string | null): string | null {
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
