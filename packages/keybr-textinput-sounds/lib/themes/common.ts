import blip from "../../assets/blip.mp3";
import { type ThemeConfig } from "../sound.ts";

export const common = {
  blip: [blip],
} as const satisfies Partial<ThemeConfig>;
