import { expectType, request } from "@keybr/request";
import { getAudioContext } from "./context.ts";
import { pickUrl } from "./mediatypes.ts";
import { NullPlayer, WebAudioPlayer } from "./player.ts";
import { type Player, type PlayerConfig } from "./types.ts";

export async function loadPlayer(config: PlayerConfig): Promise<Player> {
  const context = getAudioContext();
  if (context != null) {
    const url = pickUrl(config.urls);
    if (url != null) {
      const response = await request.use(expectType("audio/*")).GET(url).send();
      const body = await response.arrayBuffer();
      const buffer = await context.decodeAudioData(body);
      return new WebAudioPlayer(context, buffer);
    }
  }
  return nullPlayer();
}

export function nullPlayer(): Player {
  return new NullPlayer();
}
