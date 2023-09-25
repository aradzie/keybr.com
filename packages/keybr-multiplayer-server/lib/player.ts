import {
  type BasicPlayer,
  type ClientMessage,
  makeTextInput,
  type PlayerState,
  type ServerMessage,
} from "@keybr/multiplayer-shared";
import { type AnyUser } from "@keybr/pages-shared";
import { type TextInput } from "@keybr/textinput";
import { Timer } from "@keybr/timer";
import { type Room } from "./room.ts";
import { type Client, type Session } from "./types.ts";

export enum ReadyState {
  CONNECTED = 1,
  ANNOUNCED = 2,
  KICKED = 3,
}

export class Player implements Client, BasicPlayer, PlayerState {
  readonly #session: Session;
  readonly #id: number;
  readonly #user: AnyUser;
  state: ReadyState = ReadyState.CONNECTED;
  room: Room | null = null;
  textInput: TextInput = makeTextInput("");
  spectator: boolean = false;
  finished: boolean = false;
  position: number = 0;
  offset: number = 0;
  speed: number = 0;
  errors: number = 0;
  lastActivity: number = 0;
  lastInput: number = 0;
  gamesCompleted: number = 0;
  gamesWon: number = 0;

  constructor(session: Session, id: number) {
    this.#session = session;
    this.#id = id;
    this.#user = session.user;
    const now = Timer.now();
    this.lastActivity = now;
    this.lastInput = now;
  }

  get id(): number {
    return this.#id;
  }

  get user(): AnyUser {
    return this.#user;
  }

  join(room: Room | null): void {
    if (this.room !== room) {
      if (this.room != null) {
        this.room.leave(this);
      }
      this.room = room;
      if (this.room != null) {
        this.room.join(this);
      }
    }
  }

  send(message: ServerMessage): void {
    this.#session.send(message);
  }

  close(code?: number, data?: string): void {
    this.#session.close(code, data);
  }

  onPing(data: ArrayBuffer): void {
    // this.session.pong(data);
  }

  onPong(data: ArrayBuffer): void {
    // this.session.ping(data);
  }

  onMessage(message: ClientMessage): void {
    const { room } = this;
    if (room == null) {
      throw new Error("Not in a room");
    }
    room.onPlayerMessage(this, message);
  }

  onClose(code: number, reason: string): void {
    const { room } = this;
    if (room == null) {
      throw new Error("Not in a room");
    }
    room.leave(this);
  }

  reset(text: string): void {
    this.textInput = makeTextInput(text);
    this.spectator = false;
    this.finished = false;
    this.position = 0;
    this.offset = 0;
    this.speed = 0;
    this.errors = 0;
  }
}
