import { useState } from "react";
import { screenScrollOffset } from "../utils/geometry.ts";
import { type Point } from "../utils/point.ts";
import { useWindowEvent } from "./use-window-event.ts";

export const useScreenScroll = (): Point => {
  const [offset, setOffset] = useState(screenScrollOffset());
  useWindowEvent("scroll", () => {
    setOffset(screenScrollOffset());
  });
  return offset;
};
