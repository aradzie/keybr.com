import { Reader, scramble, Writer } from "@keybr/binary";
import { type Codec } from "./codec.ts";
import { readUser } from "./codec.user.ts";
import { MessageError } from "./errors.ts";
import {
  type ClientMessage,
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  type GameConfigMessage,
  type GameReadyMessage,
  type GameState,
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
import { type BasicPlayer, type PlayerState } from "./types.ts";

export class ClientCodec implements Codec<ServerMessage, ClientMessage> {
  decode(data: Uint8Array): ServerMessage {
    const reader = new Reader(data);
    const type = reader.getUint8();
    switch (type) {
      case PLAYER_JOIN_ID:
        return readPlayerJoin(reader);
      case PLAYER_LEAVE_ID:
        return readPlayerLeave(reader);
      case GAME_CONFIG_ID:
        return readGameConfig(reader);
      case GAME_READY_ID:
        return readGameReady(reader);
      case GAME_WORLD_ID:
        return readGameWorld(reader);
      default:
        throw new MessageError("Unrecognized server message " + type);
    }
  }

  encode(message: ClientMessage): Uint8Array {
    switch (message.type) {
      case PLAYER_ANNOUNCE_ID:
        return scramble(writePlayerAnnounce(message));
      case PLAYER_PROGRESS_ID:
        return scramble(writePlayerProgress(message));
    }
  }
}

function readPlayerJoin(reader: Reader): PlayerJoinMessage {
  const joinedId = reader.getUint32();
  const players: BasicPlayer[] = [];
  for (let count = reader.getUint8(); count > 0; count--) {
    const id = reader.getUint32();
    const user = readUser(reader);
    players.push({ id, user });
  }
  return { type: PLAYER_JOIN_ID, joinedId, players };
}

function readPlayerLeave(reader: Reader): PlayerLeaveMessage {
  const leftId = reader.getUint32();
  const players: BasicPlayer[] = [];
  for (let count = reader.getUint8(); count > 0; count--) {
    const id = reader.getUint32();
    const user = readUser(reader);
    players.push({ id, user });
  }
  return { type: PLAYER_LEAVE_ID, leftId, players };
}

function readGameConfig(reader: Reader): GameConfigMessage {
  const text = reader.getString();
  return { type: GAME_CONFIG_ID, text };
}

function readGameReady(reader: Reader): GameReadyMessage {
  const gameState = reader.getUint8() as GameState;
  const countDown = reader.getUint8();
  return { type: GAME_READY_ID, gameState, countDown };
}

function readGameWorld(reader: Reader): GameWorldMessage {
  const elapsed = reader.getUint32();
  const playerState = new Map<number, PlayerState>();
  for (let count = reader.getUint8(); count > 0; count--) {
    const id = reader.getUint32();
    const flags = reader.getUint8();
    const position = reader.getUint8();
    const offset = reader.getUint16();
    const speed = reader.getUint16();
    const errors = reader.getUint16();
    const spectator = Boolean(flags & 1);
    const finished = Boolean(flags & 2);
    playerState.set(id, {
      spectator,
      finished,
      position,
      offset,
      speed,
      errors,
    });
  }
  return { type: GAME_WORLD_ID, elapsed, playerState };
}

function writePlayerAnnounce(message: PlayerAnnounceMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(PLAYER_ANNOUNCE_ID);
  writer.putUint32(message.signature);
  return writer.buffer();
}

function writePlayerProgress(message: PlayerProgressMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(PLAYER_PROGRESS_ID);
  writer.putUint32(message.elapsed);
  writer.putUint32(message.codePoint);
  return writer.buffer();
}
