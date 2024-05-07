import { type Keyboard, KeyboardContext } from "@keybr/keyboard";
import { type MouseProps, type WheelProps } from "@keybr/widget";
import { type CSSProperties, memo, type ReactNode } from "react";
import { Patterns } from "./Patterns.tsx";
import { getFrameSize } from "./shapes.tsx";
import * as styles from "./VirtualKeyboard.module.less";

export const VirtualKeyboard = memo(function VirtualKeyboard({
  children,
  keyboard,
  width,
  height,
  style,
  ...rest
}: {
  readonly children?: ReactNode;
  readonly keyboard: Keyboard;
  readonly width?: string;
  readonly height?: string;
  readonly style?: CSSProperties;
} & MouseProps &
  WheelProps): ReactNode {
  const size = getFrameSize(keyboard);
  return (
    <svg
      className={styles.keyboard}
      viewBox={`0 0 ${size.width} ${size.height}`}
      style={{ aspectRatio: `${size.width}/${size.height}`, ...style }}
      width={width}
      height={height}
      {...rest}
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
