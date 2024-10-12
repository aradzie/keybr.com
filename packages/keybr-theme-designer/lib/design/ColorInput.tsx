import { type CustomTheme, type PropName } from "@keybr/themes";
import { Color } from "@keybr/widget";
import { useRef } from "react";
import { useCustomTheme } from "../context/context.ts";

export const black = Color.parse("#000000");
export const gray = Color.parse("#999999");
export const white = Color.parse("#FFFFFF");

export type Accessor = {
  readonly getColor: (theme: CustomTheme) => Color;
  readonly setColor: (theme: CustomTheme, color: Color) => CustomTheme;
};

export const makeAccessor = (prop: PropName): Accessor => {
  return {
    getColor: (theme) => theme.getColor(prop) ?? gray,
    setColor: (theme, color) => theme.set(prop, color),
  } as Accessor;
};

export function ColorInput({ accessor }: { readonly accessor: Accessor }) {
  const { theme, setTheme } = useCustomTheme();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <input
      ref={ref}
      type="color"
      value={accessor.getColor(theme).toRgb().formatHex()}
      onChange={() => {
        setTheme(accessor.setColor(theme, Color.parse(ref.current!.value)));
      }}
    />
  );
}
