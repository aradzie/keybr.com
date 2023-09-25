export type SoundName = string | number;

export type SoundAssets = {
  readonly [name: SoundName]: PlayerConfig;
};

export type PlayerConfig = {
  readonly urls: readonly string[];
};

export type Player = {
  play(offset?: number, duration?: number): void;
  stop(): void;
  volume(volume: number): void;
};
