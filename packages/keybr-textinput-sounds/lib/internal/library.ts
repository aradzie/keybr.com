import { expectType, request } from "@keybr/request";
import { getAudioContext } from "./audiocontext.ts";
import { nullPlayer, WebAudioPlayer } from "./player.ts";
import { type Player, type PlayerId, type SoundAssets } from "./types.ts";

export class PlayerLibrary {
  readonly #loaders = new Map<PlayerId, PlayerLoader>();

  constructor(assets: SoundAssets) {
    for (const [id, url] of Object.entries(assets)) {
      this.#loaders.set(id, new PlayerLoader(url));
    }
  }

  play(id: PlayerId, volume: number = 1) {
    const loader = this.#loaders.get(id);
    if (loader == null) {
      throw new Error(String(id));
    }
    loader
      .init()
      .then((player) => {
        player.volume(volume);
        player.play();
      })
      .catch(catchError);
  }
}

class PlayerLoader {
  readonly #url: string;
  #buffer: ArrayBuffer | null = null;
  #player: Player | null = null;

  constructor(url: string) {
    this.#url = url;
    this.#load().catch(catchError);
  }

  get url() {
    return this.#url;
  }

  /**
   * Stage one: we load sound data, but we don't create players yet
   * because there was no user gesture and AudioContext is not available.
   */
  async #load() {
    try {
      const response = await request
        .use(expectType("audio/*"))
        .GET(this.#url)
        .send();
      this.#buffer = await response.arrayBuffer();
    } catch (err) {
      this.#player = nullPlayer;
      throw err;
    }
  }

  /**
   * Stage two: we convert the loaded sound data into players.
   * We assume that at this point there was a user gesture
   * and AudioContext is already available.
   */
  async init() {
    if (this.#buffer != null && this.#player == null) {
      try {
        const context = getAudioContext();
        if (context != null) {
          const buffer = await context.decodeAudioData(this.#buffer);
          const player = new WebAudioPlayer(context, buffer);
          this.#buffer = null;
          this.#player = player;
        } else {
          this.#buffer = null;
          this.#player = nullPlayer;
        }
      } catch (err) {
        this.#buffer = null;
        this.#player = nullPlayer;
        throw err;
      }
    }
    return this.#player ?? nullPlayer;
  }
}

function catchError(err: any) {
  console.error(err);
}
