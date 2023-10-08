import { loadPlayer, nullPlayer } from "./loader.ts";
import { type Player, type SoundAssets, type SoundName } from "./types.ts";

const library = {
  players: new Map<SoundName, Player>(),
  enable: false,
};

export function loadSounds(assets: SoundAssets): void {
  for (const [name, config] of Object.entries(assets)) {
    if (!library.players.has(name)) {
      library.players.set(name, nullPlayer());
      loadPlayer(config).then(
        (player) => {
          library.players.set(name, player);
        },
        (error) => {
          console.log(error);
        },
      );
    }
  }
}

export function enableSounds(enable: boolean): void {
  library.enable = enable;
}

export function playSound(name: SoundName): void {
  const player = library.players.get(name);
  if (player == null) {
    throw new Error(String(name));
  }
  if (library.enable) {
    player.play();
  }
}
