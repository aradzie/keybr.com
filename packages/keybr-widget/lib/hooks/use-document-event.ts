import { useEffect } from "react";

export const useDocumentEvent = <K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
): void => {
  useEffect(() => {
    document.addEventListener(type, listener, options);
    return () => {
      document.removeEventListener(type, listener);
    };
  }, [type, listener, options]);
};
