import { useEffect, useRef } from "react";

export const useDocumentEvent = <K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void => {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;
  useEffect(() => {
    const listener = (ev: any): void => {
      listenerRef.current.call(document, ev);
    };
    document.addEventListener(type, listener, options);
    return () => {
      document.removeEventListener(type, listener);
    };
  }, [type, options]);
};
