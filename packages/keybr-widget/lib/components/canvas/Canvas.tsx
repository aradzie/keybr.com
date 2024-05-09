import { memo, type ReactNode, type RefObject, useEffect, useRef } from "react";
import { useElementSize } from "../../hooks/use-element-size.ts";
import { type Size } from "../../utils/size.ts";
import { type MouseProps, type WheelProps } from "../types.ts";
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
  ...props
}: {
  readonly paint: PaintCallback;
  readonly title?: string;
} & MouseProps &
  WheelProps): ReactNode {
  const ref = useCanvas(paint);
  return (
    <canvas
      {...props}
      ref={ref}
      title={title}
      style={{
        display: "block",
        position: "absolute",
        insetInlineStart: "0px",
        insetBlockStart: "0px",
        inlineSize: "100%",
        blockSize: "100%",
        margin: "0px",
        padding: "0px",
        borderStyle: "none",
      }}
    />
  );
});
