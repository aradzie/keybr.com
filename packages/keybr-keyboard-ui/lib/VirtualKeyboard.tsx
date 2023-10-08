import { type Keyboard, KeyboardContext } from "@keybr/keyboard";
import { memo, type ReactNode } from "react";
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
}: {
  readonly children?: ReactNode;
  readonly keyboard: Keyboard;
  readonly width?: string;
  readonly height?: string;
}): ReactNode {
  const size = keyboard.extraKeys.length > 0 ? extended : compact;
  return (
    <svg
      className={styles.keyboard}
      viewBox={`0 0 ${size.width} ${size.height}`}
      style={{ aspectRatio: `${size.width}/${size.height}` }}
      width={width}
      height={height}
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
