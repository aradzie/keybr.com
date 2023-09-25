import { Reader, unscramble, Writer } from "@keybr/binary";
import { type Codec } from "./codec.ts";
import { writeUser } from "./codec.user.ts";
import { MessageError } from "./errors.ts";
import {
  type ClientMessage,
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  type GameConfigMessage,
  type GameReadyMessage,
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

export class ServerCodec implements Codec<ClientMessage, ServerMessage> {
  decode(data: Uint8Array): ClientMessage {
    const reader = new Reader(unscramble(data));
    const type = reader.getUint8();
    switch (type) {
      case PLAYER_ANNOUNCE_ID:
        return readPlayerAnnounce(reader);
      case PLAYER_PROGRESS_ID:
        return readPlayerProgress(reader);
      default:
        throw new MessageError("Unrecognized client message " + type);
    }
  }

  encode(message: ServerMessage): Uint8Array {
    switch (message.type) {
      case PLAYER_JOIN_ID:
        return writePlayerJoin(message);
      case PLAYER_LEAVE_ID:
        return writePlayerLeave(message);
      case GAME_CONFIG_ID:
        return writeGameConfig(message);
      case GAME_READY_ID:
        return writeGameReady(message);
      case GAME_WORLD_ID:
        return writeGameWorld(message);
    }
  }
}

function readPlayerAnnounce(reader: Reader): PlayerAnnounceMessage {
  const signature = reader.getUint32();
  return { type: PLAYER_ANNOUNCE_ID, signature };
}

function readPlayerProgress(reader: Reader): PlayerProgressMessage {
  const elapsed = reader.getUint32();
  const codePoint = reader.getUint32();
  return { type: PLAYER_PROGRESS_ID, elapsed, codePoint };
}

function writePlayerJoin(message: PlayerJoinMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(PLAYER_JOIN_ID);
  writer.putUint32(message.joinedId);
  const players = message.players;
  writer.putUint8(players.length);
  for (const player of players) {
    writer.putUint32(player.id);
    writeUser(player.user, writer);
  }
  return writer.buffer();
}

function writePlayerLeave(message: PlayerLeaveMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(PLAYER_LEAVE_ID);
  writer.putUint32(message.leftId);
  const players = message.players;
  writer.putUint8(players.length);
  for (const player of players) {
    writer.putUint32(player.id);
    writeUser(player.user, writer);
  }
  return writer.buffer();
}

function writeGameConfig(message: GameConfigMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(GAME_CONFIG_ID);
  writer.putString(message.text);
  return writer.buffer();
}

function writeGameReady(message: GameReadyMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(GAME_READY_ID);
  writer.putUint8(message.gameState);
  writer.putUint8(message.countDown);
  return writer.buffer();
}

function writeGameWorld(message: GameWorldMessage): Uint8Array {
  const writer = new Writer();
  writer.putUint8(GAME_WORLD_ID);
  writer.putUint32(message.elapsed);
  const players = [...message.playerState];
  writer.putUint8(players.length);
  for (const [id, player] of players) {
    writer.putUint32(id);
    writer.putUint8((player.spectator ? 1 : 0) | (player.finished ? 2 : 0));
    writer.putUint8(player.position);
    writer.putUint16(player.offset);
    writer.putUint16(player.speed);
    writer.putUint16(player.errors);
  }
  return writer.buffer();
}
