import { injectable } from "@fastr/invert";
import { Tasks } from "@keybr/lang";
import { Player } from "./player.ts";
import { Room } from "./room.ts";
import {
  type Client,
  type PlayerStats,
  type RoomStats,
  type Session,
  type TotalStats,
} from "./types.ts";

@injectable({ singleton: true })
export class Game {
  readonly #tasks = new Tasks();

  readonly rooms = new Set<Room>();

  readonly stats = {
    roomsCreated: 0,
    roomsDestroyed: 0,
    gamesCompleted: 0,
    playersJoined: 0,
    playersLeft: 0,
  };

  constructor() {}

  start() {
    this.#tasks.repeated(1000, () => this.#kickIdlePlayers());
  }

  joinPlayer(session: Session): Client {
    const player = new Player(session, this.#nextPlayerId());
    this.#joinPlayer(player);
    return player;
  }

  #joinPlayer(player: Player) {
    for (const room of this.rooms) {
      if (room.canJoin()) {
        room.join(player);
        return room;
      }
    }
    const room = new Room(this, this.#nextRoomId());
    this.rooms.add(room);
    room.join(player);
    return room;
  }

  collectStats(): TotalStats {
    const roomStats: RoomStats[] = [];
    for (const room of this.rooms) {
      const playerStats: PlayerStats[] = [];
      for (const player of room.players.values()) {
        playerStats.push({
          user: player.user,
          gamesCompleted: player.gamesCompleted,
          gamesWon: player.gamesWon,
        });
      }
      roomStats.push({
        gamesCompleted: room.gamesCompleted,
        playersJoined: room.playersJoined,
        playersLeft: room.playersLeft,
        playerStats,
      });
    }
    return {
      ...this.stats,
      roomStats,
    };
  }

  #kickIdlePlayers() {
    for (const room of this.rooms) {
      room.kickIdlePlayers();
    }
  }

  #roomId = 1;

  #nextRoomId() {
    return this.#roomId++;
  }

  #playerId = 1;

  #nextPlayerId() {
    return this.#playerId++;
  }
}
