import { useCallback, useEffect, useState } from "react";
import { querySelector } from "../utils/query.ts";
import { useDocumentEvent } from "./use-document-event.ts";

export function useFullscreen(
  element: Element | string,
): [boolean | null, () => void] {
  if (typeof element === "string") {
    element = querySelector(element);
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
    if (document.fullscreenElement === element) {
      element.setAttribute("data-fullscreen", "true");
    } else {
      element.removeAttribute("data-fullscreen");
    }
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
