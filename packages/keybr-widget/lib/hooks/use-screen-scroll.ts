import { useState } from "react";
import { getScreenScrollOffset } from "../utils/geometry.ts";
import { type Point } from "../utils/point.ts";
import { useWindowEvent } from "./use-window-event.ts";

export const useScreenScroll = (): Point => {
  const [offset, setOffset] = useState(getScreenScrollOffset());
  useWindowEvent("scroll", () => {
    setOffset(getScreenScrollOffset());
  });
  return offset;
};
