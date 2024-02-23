import { type FingerId, isDiacritic, type KeyShape } from "@keybr/keyboard";
import { clsx } from "clsx";
import {
  type FunctionComponent,
  memo,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { keyGap, keySize } from "./constants.ts";
import * as styles from "./Key.module.less";

export type ClassName = any;

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

export function keyTemplate(
  shape: KeyShape,
  children: ReactNode,
): FunctionComponent<KeyProps> {
  function KeyComponent(props: KeyProps): ReactNode {
    const {
      depressed,
      toggled,
      showColors,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      onMouseUp,
    } = props;
    const cn = clsx(
      styles.key,
      depressed && styles.depressedKey,
      toggled && styles.toggledKey,
      showColors && fingerStyleName(shape.finger),
    );
    return (
      <svg
        className={cn}
        x={shape.x * keySize}
        y={shape.y * keySize}
        width={shape.w * keySize - keyGap}
        height={shape.h * keySize - keyGap}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        {...{ "data-key": shape.id }}
      >
        {children}
      </svg>
    );
  }

  KeyComponent.displayName = `Key[${shape.id}]`;

  return memo(KeyComponent);
}

export const Symbol = memo(function Symbol({
  className,
  x,
  y,
  text,
  textAnchor,
}: {
  readonly className?: ClassName;
  readonly x: number;
  readonly y: number;
  readonly text: string;
  readonly textAnchor?: string;
}): ReactNode {
  const cn = clsx(styles.symbol, className);
  return (
    <text className={cn} x={x} y={y} textAnchor={textAnchor} direction="ltr">
      {text}
    </text>
  );
});

export const Primary = memo(function Primary({
  className,
  x,
  y,
  text,
  codePoint,
  textAnchor,
}: {
  readonly className?: ClassName;
  readonly x: number;
  readonly y: number;
  readonly text?: string;
  readonly codePoint?: number;
  readonly textAnchor?: string;
}): ReactNode {
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
    <text className={cn} x={x} y={y} textAnchor={textAnchor} direction="ltr">
      {text}
    </text>
  );
});

export const Secondary = memo(function Secondary({
  className,
  x,
  y,
  text,
  codePoint,
  textAnchor,
}: {
  readonly className?: ClassName;
  readonly x: number;
  readonly y: number;
  readonly text?: string;
  readonly codePoint?: number;
  readonly textAnchor?: string;
}): ReactNode {
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
    <text className={cn} x={x} y={y} textAnchor={textAnchor} direction="ltr">
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
