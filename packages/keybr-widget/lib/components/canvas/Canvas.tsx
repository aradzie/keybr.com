import {
  type FocusEventHandler,
  memo,
  type MouseEventHandler,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
} from "react";
import { useElementSize } from "../../hooks/use-element-size.ts";
import { type Size } from "../../utils/size.ts";
import { Graphics, type ShapeList } from "./graphics.ts";

export type PaintCallback = (size: Size) => ShapeList;

export const useCanvas = (
  paint: PaintCallback,
): RefObject<HTMLCanvasElement> => {
  const ref = useRef<HTMLCanvasElement>(null);
  const size = useElementSize(ref);
  useEffect(() => {
    const canvas = ref.current;
    if (canvas == null) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }
    if (size != null && size.width > 0 && size.height > 0) {
      const ratio = devicePixelRatio;
      const width = Math.max(1, size.width * ratio);
      const height = Math.max(1, size.height * ratio);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        context.scale(ratio, ratio);
      }
      new Graphics(context).paint(paint(size));
    }
  }, [paint, size]);
  return ref;
};

export const Canvas = memo(function Canvas({
  paint,
  title,
  tabIndex,
  onBlur,
  onFocus,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onMouseUp,
}: {
  readonly paint: PaintCallback;
  readonly title?: string;
  readonly tabIndex?: number;
  readonly onBlur?: FocusEventHandler;
  readonly onFocus?: FocusEventHandler;
  readonly onClick?: MouseEventHandler;
  readonly onMouseDown?: MouseEventHandler;
  readonly onMouseEnter?: MouseEventHandler;
  readonly onMouseLeave?: MouseEventHandler;
  readonly onMouseUp?: MouseEventHandler;
}): ReactNode {
  const ref = useCanvas(paint);
  return (
    <canvas
      ref={ref}
      title={title}
      tabIndex={tabIndex}
      onBlur={onBlur}
      onFocus={onFocus}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      style={{
        display: "block",
        position: "absolute",
        left: "0px",
        top: "0px",
        width: "100%",
        height: "100%",
        margin: "0px",
        padding: "0px",
        borderStyle: "none",
      }}
    />
  );
});
