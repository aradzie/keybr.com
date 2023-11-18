import { Geometry, Layout } from "@keybr/layout";
import { booleanProp, itemProp, xitemProp } from "@keybr/settings";

export const keyboardProps = {
  layout: xitemProp("keyboard.layout", Layout.ALL, Layout.getDefault()),
  geometry: itemProp("keyboard.geometry", Geometry.ALL, Geometry.STANDARD_101),
  emulate: booleanProp("keyboard.emulate", true),
  colors: booleanProp("keyboard.colors", true),
} as const;
