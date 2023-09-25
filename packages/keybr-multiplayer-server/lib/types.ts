import {
  type ClientMessage,
  type ServerMessage,
} from "@keybr/multiplayer-shared";
import { type AnyUser } from "@keybr/pages-shared";

export type Session = {
  readonly id: string;
  readonly user: AnyUser;
  ping(data?: any, mask?: boolean): void;
  pong(data?: any, mask?: boolean): void;
  send(message: ServerMessage): void;
  close(code?: number, data?: string): void;
  terminate(): void;
};

export type ClientFactory = {
  (session: Session): Client;
};

export type Client = {
  onPing(data: ArrayBuffer): void;
  onPong(data: ArrayBuffer): void;
  onMessage(message: ClientMessage): void;
  onClose(code: number, reason: string): void;
};

export type TotalStats = {
  readonly roomsCreated: number;
  readonly roomsDestroyed: number;
  readonly gamesCompleted: number;
  readonly playersJoined: number;
  readonly playersLeft: number;
  readonly roomStats: readonly RoomStats[];
};

export type RoomStats = {
  readonly gamesCompleted: number;
  readonly playersJoined: number;
  readonly playersLeft: number;
  readonly playerStats: readonly PlayerStats[];
};

export type PlayerStats = {
  readonly user: AnyUser;
  readonly gamesCompleted: number;
  readonly gamesWon: number;
};
