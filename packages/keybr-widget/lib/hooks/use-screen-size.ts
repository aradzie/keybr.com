import { useCallback, useState } from "react";
import { screenSize } from "../utils/geometry.ts";
import { type Size } from "../utils/size.ts";
import { useWindowEvent } from "./use-window-event.ts";

export const useScreenSize = (): Size => {
  const [size, setSize] = useState(screenSize());
  const listener = useCallback(() => {
    setSize(screenSize());
  }, []);
  useWindowEvent("resize", listener);
  return size;
};
