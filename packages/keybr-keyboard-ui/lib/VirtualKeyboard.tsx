import { type Keyboard, KeyboardContext } from "@keybr/keyboard";
import {
  type CSSProperties,
  memo,
  type MouseEventHandler,
  type ReactNode,
  type WheelEventHandler,
} from "react";
import { frameWidth, keyGap, keySize } from "./constants.ts";
import { Patterns } from "./Patterns.tsx";
import * as styles from "./VirtualKeyboard.module.less";

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
  const { cols, rows } = dims(keyboard);
  const viewBox = {
    width: frameWidth * 2 + cols * keySize - keyGap,
    height: frameWidth * 2 + rows * keySize - keyGap,
  };
  return (
    <svg
      className={styles.keyboard}
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      style={{ aspectRatio: `${viewBox.width}/${viewBox.height}`, ...style }}
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
        width={viewBox.width}
        height={viewBox.height}
        rx={10}
        ry={10}
      />
      <KeyboardContext.Provider value={keyboard}>
        {children}
      </KeyboardContext.Provider>
    </svg>
  );
});

function dims(keyboard: Keyboard) {
  let cols = 0;
  let rows = 0;
  for (const shape of keyboard.shapes.values()) {
    cols = Math.max(cols, shape.x + shape.w);
    rows = Math.max(rows, shape.y + shape.h);
  }
  return { cols, rows };
}
