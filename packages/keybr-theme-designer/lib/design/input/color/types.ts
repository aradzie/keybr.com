import { type Color } from "@keybr/color";

export type ColorEditorProps = {
  readonly color: Color;
  readonly onChange: (color: Color) => void;
};

export type SliderValue = {
  x: number;
  y: number;
};
