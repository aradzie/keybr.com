import test from "ava";
import { ClientCodec } from "./codec.client.ts";
import { ServerCodec } from "./codec.server.ts";
import {
  type ClientMessage,
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  type GameConfigMessage,
  type GameReadyMessage,
  GameState,
  type GameWorldMessage,
  PLAYER_ANNOUNCE_ID,
  PLAYER_JOIN_ID,
  PLAYER_LEAVE_ID,
  PLAYER_PROGRESS_ID,
  type PlayerAnnounceMessage,
  type PlayerJoinMessage,
  type PlayerLeaveMessage,
  type PlayerProgressMessage,
  type ServerMessage,
} from "./messages.ts";
import {
  basicPlayer1,
  basicPlayer2,
  basicPlayer3,
  playerState1,
  playerState2,
  playerState3,
} from "./testing/data.ts";
import { type PlayerState } from "./types.ts";

const clientCodec = new ClientCodec();
const serverCodec = new ServerCodec();

const playerJoinMessage: PlayerJoinMessage = {
  type: PLAYER_JOIN_ID,
  joinedId: 999,
  players: [basicPlayer1, basicPlayer2, basicPlayer3],
};
const playerLeaveMessage: PlayerLeaveMessage = {
  type: PLAYER_LEAVE_ID,
  leftId: 999,
  players: [basicPlayer1, basicPlayer2, basicPlayer3],
};
const gameConfigMessage: GameConfigMessage = {
  type: GAME_CONFIG_ID,
  text: "some text",
};
const gameReadyMessage: GameReadyMessage = {
  type: GAME_READY_ID,
  gameState: GameState.STARTING,
  countDown: 3,
};
const gameWorldMessage: GameWorldMessage = {
  type: GAME_WORLD_ID,
  elapsed: 12345,
  playerState: new Map<number, PlayerState>([
    [basicPlayer1.id, playerState1],
    [basicPlayer2.id, playerState2],
    [basicPlayer3.id, playerState3],
  ]),
};
const serverMessages: readonly ServerMessage[] = [
  playerJoinMessage,
  playerLeaveMessage,
  gameConfigMessage,
  gameReadyMessage,
  gameWorldMessage,
];
const playerAnnounceMessage: PlayerAnnounceMessage = {
  type: PLAYER_ANNOUNCE_ID,
  signature: 0xdeadbabe,
};
const playerProgressMessage: PlayerProgressMessage = {
  type: PLAYER_PROGRESS_ID,
  elapsed: 1234,
  codePoint: 32,
};
const clientMessages: readonly ClientMessage[] = [
  playerAnnounceMessage,
  playerProgressMessage,
];

for (const original of serverMessages) {
  test(`encode and decode server message id ${original.type}`, (t) => {
    const buffer = serverCodec.encode(original);
    const decoded = clientCodec.decode(buffer);
    t.deepEqual(original, decoded);
  });
}

for (const original of clientMessages) {
  test(`encode and decode client message id ${original.type}`, (t) => {
    const buffer = clientCodec.encode(original);
    const decoded = serverCodec.decode(buffer);
    t.deepEqual(original, decoded);
  });
}
