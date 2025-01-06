import { type RefObject } from "react";
import { useDocumentEvent } from "./use-document-event.ts";

export const useOnClickOutside = (
  refs: readonly RefObject<HTMLElement | null>[],
  onClickOutside: (event: MouseEvent) => void,
) => {
  const listener = (event: MouseEvent) => {
    for (const ref of refs) {
      if (ref.current != null && ref.current.contains(event.target as Node)) {
        return;
      }
    }
    onClickOutside(event);
  };
  useDocumentEvent("mousedown", listener);
};
