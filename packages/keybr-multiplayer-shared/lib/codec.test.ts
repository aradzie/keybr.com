import { test } from "node:test";
import { deepEqual } from "rich-assert";
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
} from "./testing.ts";
import { type PlayerState } from "./types.ts";

const clientCodec = new ClientCodec();
const serverCodec = new ServerCodec();

const playerJoinMessage = {
  type: PLAYER_JOIN_ID,
  joinedId: 999,
  players: [basicPlayer1, basicPlayer2, basicPlayer3],
} satisfies PlayerJoinMessage;
const playerLeaveMessage = {
  type: PLAYER_LEAVE_ID,
  leftId: 999,
  players: [basicPlayer1, basicPlayer2, basicPlayer3],
} satisfies PlayerLeaveMessage;
const gameConfigMessage = {
  type: GAME_CONFIG_ID,
  text: "some text",
} satisfies GameConfigMessage;
const gameReadyMessage = {
  type: GAME_READY_ID,
  gameState: GameState.STARTING,
  countDown: 3,
} satisfies GameReadyMessage;
const gameWorldMessage = {
  type: GAME_WORLD_ID,
  elapsed: 12345,
  playerState: new Map<number, PlayerState>([
    [basicPlayer1.id, playerState1],
    [basicPlayer2.id, playerState2],
    [basicPlayer3.id, playerState3],
  ]),
} satisfies GameWorldMessage;
const serverMessages = [
  playerJoinMessage,
  playerLeaveMessage,
  gameConfigMessage,
  gameReadyMessage,
  gameWorldMessage,
] satisfies readonly ServerMessage[];
const playerAnnounceMessage = {
  type: PLAYER_ANNOUNCE_ID,
  signature: 0xdeadbabe,
} satisfies PlayerAnnounceMessage;
const playerProgressMessage = {
  type: PLAYER_PROGRESS_ID,
  elapsed: 1234,
  codePoint: 32,
} satisfies PlayerProgressMessage;
const clientMessages = [
  playerAnnounceMessage,
  playerProgressMessage,
] satisfies readonly ClientMessage[];

for (const original of serverMessages) {
  test(`encode and decode server message id ${original.type}`, () => {
    const buffer = serverCodec.encode(original);
    const decoded = clientCodec.decode(buffer);
    deepEqual(original, decoded);
  });
}

for (const original of clientMessages) {
  test(`encode and decode client message id ${original.type}`, () => {
    const buffer = clientCodec.encode(original);
    const decoded = serverCodec.decode(buffer);
    deepEqual(original, decoded);
  });
}
