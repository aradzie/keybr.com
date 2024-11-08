import { randomSample } from "@keybr/rand";
import {
  loadSounds,
  type PlayerConfig,
  type PlayerId,
  playSound,
  type SoundAssets,
} from "@keybr/sound";

export type SoundId = "click" | "blip";

export type ThemeConfig = Record<SoundId, readonly PlayerConfig[]>;

export class Theme {
  readonly #assets: Record<SoundId, SoundAssets>;

  constructor(theme: ThemeConfig) {
    const click = collect("click", theme.click);
    const blip = collect("blip", theme.blip);
    this.#assets = { click, blip };
    loadSounds({ ...click, ...blip });
  }

  play(id: SoundId, volume: number) {
    playSound(randomSample(Object.keys(this.#assets[id])), volume);
  }
}

function collect(id: string, configs: readonly PlayerConfig[]): SoundAssets {
  const sounds = {} as Record<PlayerId, PlayerConfig>;
  for (let i = 0; i < configs.length; i++) {
    sounds[`${id}-${i}`] = configs[i];
  }
  return sounds;
}
