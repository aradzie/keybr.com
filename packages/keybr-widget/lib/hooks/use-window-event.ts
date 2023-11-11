import { useEffect, useRef } from "react";

export const useWindowEvent = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;
  useEffect(() => {
    const listener = (ev: any): void => {
      listenerRef.current.call(window, ev);
    };
    window.addEventListener(type, listener, options);
    return () => {
      window.removeEventListener(type, listener);
    };
  }, [type, options]);
};
