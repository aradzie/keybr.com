import { type AnyUser } from "@keybr/pages-shared";
import { type LineList, type TextInput } from "@keybr/textinput";
import { type Timer } from "@keybr/timer";
import { type GameState } from "./messages.ts";

export type WorldState = {
  readonly gameState: GameState;
  readonly players: PlayerList;
  readonly textInput: TextInput;
  readonly lines: LineList;
  readonly timer: Timer;
  readonly ticker: string;
};

export type BasicPlayer = {
  readonly id: number;
  readonly user: AnyUser;
};

export type PlayerState = {
  readonly spectator: boolean;
  readonly finished: boolean;
  readonly position: number;
  readonly offset: number;
  readonly speed: number;
  readonly errors: number;
};

export type Player = BasicPlayer &
  PlayerState & {
    readonly progress: number;
  };

export type PlayerList = {
  readonly all: readonly Player[];
  readonly me: Player;
};
