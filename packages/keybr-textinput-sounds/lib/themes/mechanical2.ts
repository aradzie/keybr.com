import click1 from "../../assets/mechanical2-click1.mp3";
import click2 from "../../assets/mechanical2-click2.mp3";
import click3 from "../../assets/mechanical2-click3.mp3";
import click4 from "../../assets/mechanical2-click4.mp3";
import click5 from "../../assets/mechanical2-click5.mp3";
import { type ThemeConfig } from "../sound.ts";
import { common } from "./common.ts";

export const mechanical2 = {
  ...common,
  click: [click1, click2, click3, click4, click5],
} as const satisfies ThemeConfig;
