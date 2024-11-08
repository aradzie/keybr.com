import { type PlayerConfig } from "@keybr/sound";
import blipMp3 from "../../assets/blip.mp3";
import blipWav from "../../assets/blip.wav";

export const blip = {
  urls: [blipMp3, blipWav],
} as const satisfies PlayerConfig;
