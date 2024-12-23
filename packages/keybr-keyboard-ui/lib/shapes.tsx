import { type Keyboard, type KeyShape } from "@keybr/keyboard";
import { type MouseProps, Point, Size } from "@keybr/widget";
import { type ReactNode, type RefObject } from "react";

export const margin = 15;
export const keySize = 40;
export const keyGap = 2;

export const getKeyCenter = (shape: KeyShape): Point => {
  return new Point(
    shape.x * keySize + (shape.w * (keySize - keyGap)) / 2,
    shape.y * keySize + (shape.h * (keySize - keyGap)) / 2,
  );
};

export const getFrameSize = (keyboard: Keyboard): Size => {
  let cols = 0;
  let rows = 0;
  for (const shape of keyboard.shapes.values()) {
    cols = Math.max(cols, shape.x + shape.w);
    rows = Math.max(rows, shape.y + shape.h);
  }
  return new Size(
    margin * 2 + cols * keySize - keyGap,
    margin * 2 + rows * keySize - keyGap,
  );
};

export const Surface = ({
  children,
  ref,
  ...props
}: {
  children: ReactNode;
  ref?: RefObject<SVGSVGElement | null>;
} & MouseProps) => {
  return (
    <svg {...props} ref={ref} x={margin} y={margin} overflow="visible">
      {children}
    </svg>
  );
};
