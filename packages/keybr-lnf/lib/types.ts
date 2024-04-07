import { type IconProps } from "@keybr/widget";
import { type ReactElement } from "react";

export type ColorName = "light" | "dark";
export type FontName = "opensans" | "spectral";

export type ColorOption = {
  readonly id: ColorName;
  readonly icon: ReactElement<IconProps>;
  readonly title: string;
};

export type FontOption = {
  readonly id: FontName;
  readonly title: string;
};

export type ThemeControl = {
  readonly fullscreenState: boolean | null;
  readonly color: ColorName;
  readonly font: FontName;
  readonly toggleFullscreen: () => void;
  readonly switchColor: (color: ColorName) => void;
  readonly switchFont: (font: FontName) => void;
};
