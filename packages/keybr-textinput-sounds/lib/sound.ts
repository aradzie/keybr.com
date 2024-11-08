import { randomSample } from "@keybr/rand";
import {
  type PlayerId,
  PlayerLibrary,
  type SoundAssets,
} from "./internal/index.ts";

export type SoundId = "click" | "blip";

export type ThemeConfig = Record<SoundId, readonly string[]>;

export class Theme {
  readonly #library: PlayerLibrary;
  readonly #ids: Record<SoundId, readonly PlayerId[]>;

  constructor(theme: ThemeConfig) {
    const click = collect("click", theme.click);
    const blip = collect("blip", theme.blip);
    this.#library = new PlayerLibrary({ ...click, ...blip });
    this.#ids = { click: Object.keys(click), blip: Object.keys(blip) };
  }

  play(id: SoundId, volume: number) {
    this.#library.play(randomSample(this.#ids[id]), volume);
  }
}

function collect(id: string, urls: readonly string[]): SoundAssets {
  const sounds = {} as Record<PlayerId, string>;
  for (let i = 0; i < urls.length; i++) {
    sounds[`${id}-${i}`] = urls[i];
  }
  return sounds;
}
