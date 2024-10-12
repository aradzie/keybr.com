import { useMemo } from "react";
import { useTheme } from "./context.ts";
import { type PropName } from "./theme-props.ts";

export function useCustomProperties() {
  const { color, font } = useTheme();
  return useMemo(() => {
    use(color, font);
    const style = getComputedStyle(document.documentElement);
    return (name: PropName): string => style.getPropertyValue(name);
  }, [color, font]);
}

function use(...arg: any) {}
