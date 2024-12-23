import { memo, useEffect, useImperativeHandle, useRef } from "react";
import { useElementSize } from "../../hooks/use-element-size.ts";
import { type CanvasProps } from "./Canvas.types.ts";
import { Graphics } from "./graphics.ts";

export const Canvas = memo(function Canvas({
  className,
  id,
  paint,
  ref,
  style,
  title,
  onResize,
  ...props
}: CanvasProps) {
  const element = useRef<HTMLCanvasElement>(null);
  const size = useElementSize(element);
  useImperativeHandle(ref, () => ({
    getSize: () => size,
    getContext: (...args) => {
      const canvas = element.current!;
      return canvas.getContext.call(canvas, ...args) as any;
    },
    toBlob: (...args) => {
      const canvas = element.current!;
      canvas.toBlob.call(canvas, ...args);
    },
    toDataURL: (...args) => {
      const canvas = element.current!;
      return canvas.toDataURL.call(canvas, ...args);
    },
    paint: (paint) => {
      if (size != null && size.width > 0 && size.height > 0) {
        const canvas = element.current!;
        const context = canvas.getContext("2d")!;
        new Graphics(context).paint(paint(size));
      }
    },
  }));
  useEffect(() => {
    if (size != null && size.width > 0 && size.height > 0) {
      const canvas = element.current!;
      const context = canvas.getContext("2d")!;
      const ratio = devicePixelRatio;
      canvas.width = Math.max(1, size.width * ratio);
      canvas.height = Math.max(1, size.height * ratio);
      context.scale(ratio, ratio);
    }
  }, [size]);
  useEffect(() => {
    if (size != null && size.width > 0 && size.height > 0) {
      const canvas = element.current!;
      const context = canvas.getContext("2d")!;
      new Graphics(context).paint(paint(size));
    }
  }, [size, paint]);
  return (
    <canvas
      {...props}
      ref={element}
      id={id}
      className={className}
      style={{
        display: "block",
        inlineSize: "100%",
        blockSize: "100%",
        ...style,
      }}
      title={title}
    />
  );
});
