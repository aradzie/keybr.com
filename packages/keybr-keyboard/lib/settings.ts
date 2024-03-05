import { booleanProp, itemProp, xitemProp } from "@keybr/settings";
import { Geometry } from "./geometry.ts";
import { Layout } from "./layout.ts";

export const keyboardProps = {
  layout: xitemProp("keyboard.layout", Layout.ALL, Layout.EN_US),
  geometry: itemProp("keyboard.geometry", Geometry.ALL, Geometry.STANDARD_101),
  emulate: booleanProp("keyboard.emulate", true),
  colors: booleanProp("keyboard.colors", true),
} as const;
