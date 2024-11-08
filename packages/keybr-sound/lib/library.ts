import { expectType, request } from "@keybr/request";
import { getAudioContext } from "./audiocontext.ts";
import { pickPlayableUrl } from "./mediatypes.ts";
import { nullPlayer, WebAudioPlayer } from "./player.ts";
import {
  type Player,
  type PlayerConfig,
  type SoundAssets,
  type SoundName,
} from "./types.ts";

class PlayerLoader {
  buffer: ArrayBuffer | null = null;
  player: Player | null = null;

  constructor(readonly config: PlayerConfig) {}

  /**
   * Stage one: we load sound data, but we don't create players yet
   * because there was no user gesture and AudioContext is not available.
   */
  async load() {
    try {
      const url = pickPlayableUrl(this.config.urls);
      if (url != null) {
        const response = await request
          .use(expectType("audio/*"))
          .GET(url)
          .send();
        this.buffer = await response.arrayBuffer();
      } else {
        this.player = nullPlayer;
      }
    } catch (err) {
      this.player = nullPlayer;
      throw err;
    }
  }

  /**
   * Stage two: we convert the loaded sound data into players.
   * We assume that at this point there was a user gesture
   * and AudioContext is already available.
   */
  async init() {
    if (this.buffer != null && this.player == null) {
      try {
        const context = getAudioContext();
        if (context != null) {
          const buffer = await context.decodeAudioData(this.buffer);
          const player = new WebAudioPlayer(context, buffer);
          this.buffer = null;
          this.player = player;
        } else {
          this.buffer = null;
          this.player = nullPlayer;
        }
      } catch (err) {
        this.buffer = null;
        this.player = nullPlayer;
        throw err;
      }
    }
    return this.player ?? nullPlayer;
  }
}

const loaders = new Map<SoundName, PlayerLoader>();

export function loadSounds(assets: SoundAssets) {
  for (const [name, config] of Object.entries(assets)) {
    let loader = loaders.get(name);
    if (loader == null || loader.config !== config) {
      loader = new PlayerLoader(config);
      loaders.set(name, loader);
      loader.load().catch(catchError);
    }
  }
}

export function playSound(name: SoundName, volume: number = 1) {
  const loader = loaders.get(name);
  if (loader == null) {
    throw new Error(String(name));
  }
  loader
    .init()
    .then((player) => {
      player.volume(volume);
      player.play();
    })
    .catch(catchError);
}

function catchError(err: any) {
  console.error(err);
}
