import { useCallback, useRef } from "react";
import { useWindowEvent } from "./use-window-event.ts";

export const useMouseHover = (
  callback: (target: Element | null) => void,
): void => {
  const callbackRef = useRef(callback);
  const targetRef = useRef<EventTarget | null>(null);
  const handleMouseMove = useCallback((ev: MouseEvent): void => {
    const { target } = ev;
    if (targetRef.current !== target) {
      targetRef.current = target;
      if (target instanceof Element) {
        callbackRef.current(target);
      } else {
        callbackRef.current(null);
      }
    }
  }, []);
  callbackRef.current = callback;
  useWindowEvent("mousemove", handleMouseMove);
};
