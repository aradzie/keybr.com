export type PlayerId = symbol | string | number;

export type SoundAssets = {
  readonly [id: PlayerId]: string;
};

export type Player = {
  play(offset?: number, duration?: number): void;
  stop(): void;
  volume(volume: number): void;
};
