import { type IconProps } from "@keybr/widget";
import { type ReactElement } from "react";

export type ThemeName = "light" | "dark";
export type TextSize = "normal" | "large" | "huge";

export type ThemeOption = {
  readonly id: ThemeName;
  readonly icon: ReactElement<IconProps>;
  readonly title: string;
};

export type TextSizeOption = {
  readonly id: TextSize;
  readonly title: string;
};

export type ThemeControl = {
  readonly fullscreenState: boolean | null;
  readonly themeName: ThemeName;
  readonly textSize: TextSize;
  readonly toggleFullscreen: () => void;
  readonly switchTheme: (themeName: ThemeName) => void;
  readonly switchTextSize: (textSize: TextSize) => void;
};
