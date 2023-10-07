import soundBlipMp3 from "../assets/sound-blip.mp3";
import soundBlipWav from "../assets/sound-blip.wav";
import soundClickMp3 from "../assets/sound-click.mp3";
import soundClickWav from "../assets/sound-click.wav";
import soundCorrectMp3 from "../assets/sound-correct.mp3";
import soundCorrectWav from "../assets/sound-correct.wav";
import soundWrongMp3 from "../assets/sound-wrong.mp3";
import soundWrongWav from "../assets/sound-wrong.wav";
import { loadPlayer, nullPlayer } from "./loader.ts";
import { type Player, type SoundAssets, type SoundName } from "./types.ts";

enum TextInputSound {
  Click = "click",
  Blip = "blip",
  Correct = "correct",
  Wrong = "wrong",
}

const textInputSounds: SoundAssets = {
  [TextInputSound.Click]: { urls: [soundClickMp3, soundClickWav] },
  [TextInputSound.Blip]: { urls: [soundBlipMp3, soundBlipWav] },
  [TextInputSound.Correct]: { urls: [soundCorrectMp3, soundCorrectWav] },
  [TextInputSound.Wrong]: { urls: [soundWrongMp3, soundWrongWav] },
};

const library = {
  players: new Map<SoundName, Player>(),
  enable: false,
};

function loadAllSounds() {
  for (const [name, config] of Object.entries(textInputSounds)) {
    if (!library.players.has(name)) {
      library.players.set(name, nullPlayer());
      loadPlayer(config).then(
        (player) => {
          library.players.set(name, player);
        },
        (error) => {
          console.error(`Error loading sound player for ${name}: ${error}`);
        },
      );
    }
  }
}
loadAllSounds();

export async function loadSounds(
  assets: SoundAssets | string[],
): Promise<void> {
  const assetsToLoad = Array.isArray(assets) ? assets : Object.keys(assets);

  await Promise.all(
    assetsToLoad.map(async (asset) => {
      if (!library.players.has(asset)) {
        try {
          const config = Array.isArray(assets)
            ? { urls: [asset] }
            : assets[asset];
          const player = await loadPlayer(config);
          library.players.set(asset, player);
        } catch (error) {
          console.error(`Error loading sound player for ${asset}: ${error}`);
        }
      }
    }),
  );
}

export function enableSounds(enable: boolean): void {
  library.enable = enable;
}
export function playSound(name: SoundName): void {
  const player = library.players.get(name);
  if (player == null) {
    console.error(`Error playing sound '${name}': Player not found.`);
    throw new Error(`Sound '${name}' not found in library.`);
  }
  if (library.enable) {
    player.play();
  }
}
