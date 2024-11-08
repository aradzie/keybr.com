import click from "../../assets/default-click.mp3";
import { type ThemeConfig } from "../sound.ts";
import { common } from "./common.ts";

export const defaultTheme = {
  ...common,
  click: [click],
} as const satisfies ThemeConfig;
