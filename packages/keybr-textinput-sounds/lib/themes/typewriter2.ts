import click1 from "../../assets/typewriter2-click1.mp3";
import click2 from "../../assets/typewriter2-click2.mp3";
import click3 from "../../assets/typewriter2-click3.mp3";
import click4 from "../../assets/typewriter2-click4.mp3";
import click5 from "../../assets/typewriter2-click5.mp3";
import click6 from "../../assets/typewriter2-click6.mp3";
import click7 from "../../assets/typewriter2-click7.mp3";
import click8 from "../../assets/typewriter2-click8.mp3";
import click9 from "../../assets/typewriter2-click9.mp3";
import { type ThemeConfig } from "../sound.ts";
import { common } from "./common.ts";

export const typewriter2 = {
  ...common,
  click: [
    click1,
    click2,
    click3,
    click4,
    click5,
    click6,
    click7,
    click8,
    click9,
  ],
} as const satisfies ThemeConfig;
