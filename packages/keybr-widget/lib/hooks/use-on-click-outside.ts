import { type RefObject } from "react";
import { useDocumentEvent } from "./use-document-event.ts";

export const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  onClickOutside: (event: MouseEvent | TouchEvent) => void,
) => {
  const listener = (event: MouseEvent | TouchEvent) => {
    if (ref.current != null && !ref.current.contains(event.target as Node)) {
      onClickOutside(event);
    }
  };
  useDocumentEvent("mousedown", listener);
  useDocumentEvent("touchstart", listener);
};
