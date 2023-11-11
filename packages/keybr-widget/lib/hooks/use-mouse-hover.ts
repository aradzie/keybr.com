import { useRef } from "react";
import { useWindowEvent } from "./use-window-event.ts";

export const useMouseHover = (
  callback: (target: Element | null) => void,
): void => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const targetRef = useRef<EventTarget | null>(null);
  useWindowEvent("mousemove", (ev) => {
    const { target } = ev;
    if (targetRef.current !== target) {
      targetRef.current = target;
      if (target instanceof Element) {
        callbackRef.current(target);
      } else {
        callbackRef.current(null);
      }
    }
  });
};
