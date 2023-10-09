import { type Keyboard, KeyboardContext } from "@keybr/keyboard";
import {
  type CSSProperties,
  memo,
  type MouseEventHandler,
  type ReactNode,
  type WheelEventHandler,
} from "react";
import { Patterns } from "./Key.tsx";
import * as styles from "./VirtualKeyboard.module.less";

type Size = { readonly width: number; readonly height: number };
const extended: Size = { width: 1000, height: 250 };
const compact: Size = { width: 671, height: 250 };

export const VirtualKeyboard = memo(function VirtualKeyboard({
  children,
  keyboard,
  width,
  height,
  style,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
  onWheel,
}: {
  readonly children?: ReactNode;
  readonly keyboard: Keyboard;
  readonly width?: string;
  readonly height?: string;
  readonly style?: CSSProperties;
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
  readonly onWheel?: WheelEventHandler;
}): ReactNode {
  const size = keyboard.extraKeys.length > 0 ? extended : compact;
  return (
    <svg
      className={styles.keyboard}
      viewBox={`0 0 ${size.width} ${size.height}`}
      style={{ aspectRatio: `${size.width}/${size.height}`, ...style }}
      width={width}
      height={height}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onWheel={onWheel}
    >
      <defs>
        <Patterns />
      </defs>
      <rect
        className={styles.frame}
        x={0}
        y={0}
        width={size.width}
        height={size.height}
        rx={10}
        ry={10}
      />
      <KeyboardContext.Provider value={keyboard}>
        {children}
      </KeyboardContext.Provider>
    </svg>
  );
});
