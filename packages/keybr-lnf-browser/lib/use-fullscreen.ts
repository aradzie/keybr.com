import { useCallback, useEffect, useState } from "react";
import { installPolyfills } from "./fullscreen-polyfill.ts";

export function useFullscreen(): [boolean | null, () => void] {
  const [fullscreenState, setFullscreenState] = useState<boolean | null>(() => {
    if (document.fullscreenEnabled) {
      return document.fullscreenElement != null;
    } else {
      return null;
    }
  });

  useEffect(() => {
    installPolyfills();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setFullscreenState(document.fullscreenElement != null);
    };
    const handleFullscreenError = (): void => {
      setFullscreenState(null);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("fullscreenerror", handleFullscreenError);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("fullscreenerror", handleFullscreenError);
    };
  }, []);

  const toggleFullscreen = useCallback((): void => {
    const handleFullscreenChange = (): void => {
      setFullscreenState(document.fullscreenElement != null);
    };
    const handleFullscreenError = (): void => {
      setFullscreenState(null);
    };
    if (document.fullscreenElement == null) {
      document.documentElement
        .requestFullscreen()
        .then(handleFullscreenChange, handleFullscreenError);
    } else {
      document
        .exitFullscreen()
        .then(handleFullscreenChange, handleFullscreenError);
    }
  }, []);

  return [fullscreenState, toggleFullscreen];
}
