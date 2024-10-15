import { useEffect, useMemo, useState } from "react";

export function usePreferredColorScheme() {
  const query = "(prefers-color-scheme: dark)";
  const media = useMemo(() => window.matchMedia(query), [query]);
  const [dark, setDark] = useState(media.matches);
  useEffect(() => {
    const listener = () => {
      setDark(media.matches);
    };
    media.addEventListener("change", listener);
    return () => {
      media.removeEventListener("change", listener);
    };
  }, [media]);
  return dark;
}
