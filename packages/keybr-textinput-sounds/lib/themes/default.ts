import clickMp3 from "../../assets/default-click.mp3";
import clickWav from "../../assets/default-click.wav";
import { type ThemeConfig } from "../sound.ts";
import { blip } from "./common.ts";

export const themeDefault = {
  blip: [blip],
  click: [{ urls: [clickMp3, clickWav] }],
} as const satisfies ThemeConfig;
