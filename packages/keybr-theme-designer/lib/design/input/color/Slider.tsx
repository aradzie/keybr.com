import { clamp } from "@keybr/lang";
import {
  getBoundingBox,
  useHotkeysHandler,
  useWindowEvent,
} from "@keybr/widget";
import { type CSSProperties, type ReactElement, useRef } from "react";
import { type SliderValue } from "./types.ts";

export function Slider({
  className,
  style,
  children,
  value: { x, y },
  onChange,
}: {
  readonly className: string;
  readonly style?: CSSProperties;
  readonly children: ReactElement;
  readonly value: SliderValue;
  readonly onChange: (value: SliderValue) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const tracking = useRef(false);
  useWindowEvent("mousemove", (event) => {
    if (tracking.current) {
      event.preventDefault();
      onChange(getValue(ref.current!, event));
    }
  });
  useWindowEvent("mouseup", () => {
    tracking.current = false;
  });
  const moveLeft = () => {
    if (x > 0) {
      onChange({ x: Math.max(0, x - 0.01), y });
    }
  };
  const moveRight = () => {
    if (x < 1) {
      onChange({ x: Math.min(1, x + 0.01), y });
    }
  };
  const moveUp = () => {
    if (y < 1) {
      onChange({ x, y: Math.min(1, y + 0.01) });
    }
  };
  const moveDown = () => {
    if (y > 0) {
      onChange({ x, y: Math.max(0, y - 0.01) });
    }
  };
  return (
    <div
      ref={ref}
      className={className}
      style={style}
      tabIndex={0}
      onMouseDown={(event) => {
        ref.current!.focus();
        tracking.current = true;
        event.preventDefault();
        onChange(getValue(ref.current!, event));
      }}
      onKeyDown={useHotkeysHandler({
        ["ArrowLeft"]: moveLeft,
        ["ArrowRight"]: moveRight,
        ["ArrowUp"]: moveUp,
        ["ArrowDown"]: moveDown,
      })}
    >
      {children}
    </div>
  );
}

function getValue(
  element: HTMLElement,
  { clientX, clientY }: { readonly clientX: number; readonly clientY: number },
): SliderValue {
  const { left, top, right, bottom, width, height } = getBoundingBox(element);
  return {
    x: (clamp(clientX, left, right) - left) / width,
    y: 1 - (clamp(clientY, top, bottom) - top) / height,
  };
}
