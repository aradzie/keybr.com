import { useDynamicStyles } from "@keybr/widget";
import { useMemo } from "react";
import { useTheme } from "./context.ts";
import { type PropName } from "./theme-props.ts";

export function useCustomProperties() {
  const { color, font } = useTheme();
  const { getStyledElement } = useDynamicStyles();
  const element = getStyledElement();
  return useMemo(() => {
    use(color, font);
    const style = getComputedStyle(element);
    return (name: PropName): string => style.getPropertyValue(name);
  }, [color, font, element]);
}

function use(...arg: any) {}
