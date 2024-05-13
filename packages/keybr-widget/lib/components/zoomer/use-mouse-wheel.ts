import { useEffect, useRef } from "react";

// Attaches a non-passive mouse wheel event handler
// that actually can prevent default.
// https://github.com/facebook/react/issues/14856
export function useMouseWheel(
  element: HTMLElement | null,
  handler: (event: WheelEvent) => void,
): void {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    if (element == null) {
      return;
    }
    const handler = (ev: WheelEvent): void => {
      ref.current.call(element, ev);
    };
    element.addEventListener("wheel", handler);
    return () => {
      element.removeEventListener("wheel", handler);
    };
  }, [element]);
}
