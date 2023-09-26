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
  readonly keyboardKey: KeyboardKey;
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
  readonly showZones?: boolean;
  readonly children?: ReactNode;
};

export const Key = memo(makeKeyComponent(/* special= */ false));
export const SpecialKey = memo(makeKeyComponent(/* special= */ true));

function makeKeyComponent(special: boolean): FunctionComponent<KeyProps> {
  return function Key(props: KeyProps): ReactNode {
    const {
      depressed,
      keyboardKey: { id, geometry },
      showZones,
      children,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = props;
    const cn = clsx(
      styles.key,
      special ? styles.specialKey : styles.simpleKey,
      depressed && styles.depressedKey,
      showZones && zoneStyleName(geometry.zone),
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
  return (
    <>
      <pattern
        id="key-zone-a"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternBackground} d="M0 0h10v10H0z" />
        <path className={styles.patternA} d="M-1 1l2-2M0 10L10 0M9 11l2-2" />
      </pattern>
      <pattern
        id="key-zone-b"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <path className={styles.patternBackground} d="M10 0H0v10h10z" />
        <path className={styles.patternB} d="M11 1L9-1m1 11L0 0m1 11l-2-2" />
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

function zoneStyleName(zone: string | null): string | null {
  switch (zone) {
    case "z1":
      return styles.zone1;
    case "z2":
      return styles.zone2;
    case "z3":
      return styles.zone3;
    case "z4":
      return styles.zone4;
    case "z5":
      return styles.zone5;
    case "z6":
      return styles.zone6;
    case "z7":
      return styles.zone7;
    case "z8":
      return styles.zone8;
    default:
      return null;
  }
}
