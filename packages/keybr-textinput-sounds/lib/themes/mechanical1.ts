import click1Mp3 from "../../assets/mechanical1-click1.mp3";
import click1Wav from "../../assets/mechanical1-click1.wav";
import click2Mp3 from "../../assets/mechanical1-click2.mp3";
import click2Wav from "../../assets/mechanical1-click2.wav";
import click3Mp3 from "../../assets/mechanical1-click3.mp3";
import click3Wav from "../../assets/mechanical1-click3.wav";
import click4Mp3 from "../../assets/mechanical1-click4.mp3";
import click4Wav from "../../assets/mechanical1-click4.wav";
import click5Mp3 from "../../assets/mechanical1-click5.mp3";
import click5Wav from "../../assets/mechanical1-click5.wav";
import { type ThemeConfig } from "../sound.ts";
import { blip } from "./common.ts";

export const themeMechanical1 = {
  blip: [blip],
  click: [
    { urls: [click1Mp3, click1Wav] },
    { urls: [click2Mp3, click2Wav] },
    { urls: [click3Mp3, click3Wav] },
    { urls: [click4Mp3, click4Wav] },
    { urls: [click5Mp3, click5Wav] },
  ],
} as const satisfies ThemeConfig;
