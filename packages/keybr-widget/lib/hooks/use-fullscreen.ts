import { useCallback, useEffect, useState } from "react";
import { querySelector } from "../utils/query.ts";
import { useDocumentEvent } from "./use-document-event.ts";

export function useFullscreen(
  element: HTMLElement | string,
): [boolean | null, () => void] {
  if (typeof element === "string") {
    element = querySelector<HTMLElement>(element);
  }

  const [fullscreenState, setFullscreenState] = useState<boolean | null>(null);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenEnabled) {
      if (document.fullscreenElement !== element) {
        element.requestFullscreen().catch(() => {
          setFullscreenState(null);
        });
      } else {
        document.exitFullscreen().catch(() => {
          setFullscreenState(null);
        });
      }
    }
  }, [element]);

  useDocumentEvent("fullscreenchange", () => {
    setFullscreenState(
      document.fullscreenEnabled
        ? document.fullscreenElement === element
        : null,
    );
  });

  useDocumentEvent("fullscreenerror", () => {
    setFullscreenState(null);
  });

  useEffect(() => {
    setFullscreenState(
      document.fullscreenEnabled
        ? document.fullscreenElement === element
        : null,
    );
  }, [element]);

  return [fullscreenState, toggleFullscreen];
}
