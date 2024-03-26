import { injectable } from "@fastr/invert";
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
  readonly stats = {
    roomsCreated: 0,
    roomsDestroyed: 0,
    gamesCompleted: 0,
    playersJoined: 0,
    playersLeft: 0,
  };

  readonly rooms = new Set<Room>(); // TODO Make private?

  constructor() {}

  start(): void {
    setInterval(() => this.#kickIdlePlayers(), 1000);
  }

  joinPlayer(session: Session): Client {
    const player = new Player(session, this.#nextPlayerId());
    this.#joinPlayer(player);
    return player;
  }

  #joinPlayer(player: Player): Room {
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

  #kickIdlePlayers(): void {
    for (const room of this.rooms) {
      room.kickIdlePlayers();
    }
  }

  #roomId = 1;

  #nextRoomId(): number {
    return this.#roomId++;
  }

  #playerId = 1;

  #nextPlayerId(): number {
    return this.#playerId++;
  }
}
