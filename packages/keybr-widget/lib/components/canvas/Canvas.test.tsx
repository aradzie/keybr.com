import { test } from "node:test";
import { render } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { type Size } from "../../utils/size.ts";
import { Canvas } from "./Canvas.tsx";
import { type CanvasRef } from "./Canvas.types.ts";
import { type Graphics } from "./graphics.ts";

test("render", () => {
  const paint =
    ({ width, height }: Size) =>
    (g: Graphics) => {
      g.clear(0, 0, width, height);
    };

  function UnderTest() {
    const ref = useRef<CanvasRef>(null);
    useEffect(() => {
      ref.current!.paint(paint);
      ref.current!.getContext("2d")!.rect(0, 0, 100, 100);
    }, []);
    return <Canvas ref={ref} paint={paint} />;
  }

  const r = render(<UnderTest />);

  r.unmount();
});
