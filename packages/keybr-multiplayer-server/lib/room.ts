import assert from "node:assert";
import { nextQuote } from "@keybr/content-quotes";
import { type Task, Tasks, Timer } from "@keybr/lang";
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
  PLAYER_KICKED,
  PLAYER_LEAVE_ID,
  PLAYER_PROGRESS_ID,
  type PlayerAnnounceMessage,
  type PlayerJoinMessage,
  type PlayerLeaveMessage,
  type PlayerProgressMessage,
  type PlayerState,
  type ServerMessage,
} from "@keybr/multiplayer-shared";
import { computeSpeed, countErrors } from "@keybr/textinput";
import { type Game } from "./game.ts";
import { type Player, ReadyState } from "./player.ts";

export class Room {
  static nextQuote = nextQuote;

  readonly #tasks = new Tasks();
  readonly #game: Game;
  readonly #id: number;
  readonly #roomSize: number = 5;
  readonly players = new Map<number, Player>();
  #gameState = GameState.INITIALIZING;
  #startTask: Task | null = null;
  #countDown: number = 0;
  #started: number = 0;
  #finishOrder: number = 0;
  #text: string = "";
  playersJoined: number = 0;
  playersLeft: number = 0;
  gamesCompleted: number = 0;

  constructor(game: Game, id: number) {
    this.#game = game;
    this.#id = id;
    this.#onCreateRoom();
  }

  destroy() {
    this.#onDestroyRoom();
    this.#game.rooms.delete(this);
    if (this.#startTask != null) {
      this.#startTask.cancel();
      this.#startTask = null;
    }
    this.#tasks.cancelAll();
    for (const player of this.players.values()) {
      this.#kick(player);
    }
    this.#gameState = GameState.INITIALIZING;
  }

  canJoin() {
    return this.players.size < this.#roomSize;
  }

  join(player: Player) {
    if (this.players.has(player.id)) {
      return;
    }
    this.players.set(player.id, player);
    player.join(this);
  }

  #completeJoin(player: Player, message: PlayerAnnounceMessage) {
    if (message.signature !== 0xdeadbabe) {
      this.#kick(player);
      return;
    }
    player.state = ReadyState.ANNOUNCED;
    this.#onPlayerJoin(player);
    player.reset(this.#text);
    this.#broadcast(this.#makePlayerJoinMessage(player));
    switch (this.#gameState) {
      case GameState.INITIALIZING:
        this.#gameState = GameState.WAITING;
        player.send(this.#makeGameReadyMessage());
        break;
      case GameState.WAITING:
        player.send(this.#makeGameReadyMessage());
        if (this.players.size > 1) {
          this.#scheduleNewGame();
        }
        break;
      case GameState.STARTING:
      case GameState.RUNNING:
      case GameState.FINISHED:
        player.spectator = true;
        player.send(this.#makeGameConfigMessage());
        player.send(this.#makeGameReadyMessage());
        break;
    }
  }

  leave(player: Player) {
    if (!this.players.has(player.id)) {
      return;
    }
    this.players.delete(player.id);
    player.join(null);
    this.#onPlayerLeave(player);
    player.reset(this.#text);
    this.#broadcast(this.#makePlayerLeaveMessage(player));
    if (this.players.size === 0) {
      this.destroy();
    } else if (this.players.size === 1) {
      // Re-balance rooms.
      const [player0] = this.players.values();
      for (const room of this.#game.rooms) {
        if (room !== this && room.canJoin()) {
          room.join(player0);
          return;
        }
      }
      this.#waitForPlayers();
    }
  }

  kickIdlePlayers() {
    const now = Timer.now();
    if (this.#gameState !== GameState.WAITING) {
      for (const player of this.players.values()) {
        if (now - player.lastActivity > 180000) {
          this.#kick(player, PLAYER_KICKED);
        }
      }
    }
    if (this.#gameState === GameState.RUNNING) {
      let changed = false;
      for (const player of this.players.values()) {
        if (!player.spectator && !player.finished) {
          if (now - player.lastInput > 15000) {
            player.spectator = true;
            changed = true;
          }
        }
      }
      if (changed) {
        this.#broadcast(this.#makeGameWorldMessage());
        this.#maybeFinishGame();
      }
    }
  }

  onPlayerMessage(player: Player, message: ClientMessage) {
    switch (message.type) {
      case PLAYER_ANNOUNCE_ID:
        if (player.state === ReadyState.CONNECTED) {
          this.#completeJoin(player, message);
        } else {
          this.#kick(player);
        }
        break;
      case PLAYER_PROGRESS_ID:
        if (player.state === ReadyState.ANNOUNCED) {
          this.#onPlayerProgress(player, message);
        } else {
          this.#kick(player);
        }
        break;
      default:
        this.#kick(player);
        break;
    }
  }

  #onPlayerProgress(player: Player, message: PlayerProgressMessage) {
    const now = Timer.now();
    player.lastActivity = now;
    if (this.#gameState === GameState.RUNNING) {
      if (!player.spectator && !player.finished) {
        player.lastInput = now;
        player.textInput.appendChar(now, message.codePoint, 0);
        updatePlayer(player, this.#started);
        if (player.textInput.completed) {
          player.finished = true;
          player.position = this.#finishOrder++;
        }
        this.#updatePlayerPositions();
        this.#broadcast(this.#makeGameWorldMessage());
        this.#maybeFinishGame();
      }
    }
  }

  #updatePlayerPositions() {
    const players = [];
    for (const player of this.players.values()) {
      if (player.spectator) {
        player.position = 0;
      } else if (!player.finished) {
        players.push(player);
      }
    }
    players.sort((a, b) => b.offset - a.offset);
    let finishOrder = this.#finishOrder;
    for (const player of players) {
      player.position = finishOrder++;
    }
  }

  #waitForPlayers() {
    if (this.#startTask != null) {
      this.#startTask.cancel();
      this.#startTask = null;
    }
    this.#gameState = GameState.WAITING;
    for (const player of this.players.values()) {
      player.reset(this.#text);
    }
    this.#broadcast(this.#makeGameReadyMessage());
  }

  #scheduleNewGame() {
    if (this.#startTask != null) {
      this.#startTask.cancel();
      this.#startTask = null;
    }
    this.#startTask = this.#tasks.delayed(3000, () => {
      this.#startTask = null;
      if (this.players.size > 1) {
        this.#gameState = GameState.STARTING;
        this.#countDown = 3;
        this.#text = Room.nextQuote();
        for (const player of this.players.values()) {
          player.reset(this.#text);
        }
        this.#finishOrder = 1;
        this.#broadcast(this.#makeGameConfigMessage());
        this.#startTask = this.#tasks.delayed(1000, () => {
          this.#startTask = null;
          this.#startStep();
        });
      }
    });
  }

  #startStep() {
    if (this.players.size > 1) {
      if (this.#countDown === 0) {
        const now = Timer.now();
        this.#started = now;
        for (const player of this.players.values()) {
          player.lastInput = now;
        }
        this.#gameState = GameState.RUNNING;
        this.#broadcast(this.#makeGameReadyMessage());
        this.#broadcast(this.#makeGameWorldMessage());
      } else {
        this.#gameState = GameState.STARTING;
        this.#broadcast(this.#makeGameReadyMessage());
        this.#countDown -= 1;
        this.#startTask = this.#tasks.delayed(1000, () => {
          this.#startTask = null;
          this.#startStep();
        });
      }
    }
  }

  #maybeFinishGame() {
    assert(this.#gameState === GameState.RUNNING);
    if (this.#isFinished()) {
      this.#finishGame();
    }
  }

  #finishGame() {
    assert(this.#gameState === GameState.RUNNING);
    this.#onFinishGame();
    this.#gameState = GameState.FINISHED;
    this.#broadcast(this.#makeGameReadyMessage());
    this.#scheduleNewGame();
  }

  #isFinished(): boolean {
    assert(this.#gameState === GameState.RUNNING);
    let running = 0;
    for (const player of this.players.values()) {
      if (!player.spectator && !player.finished) {
        running += 1;
        if (running > 1) {
          return false;
        }
      }
    }
    return true;
  }

  #elapsed() {
    assert(this.#gameState === GameState.RUNNING);
    return Math.trunc(Timer.now() - this.#started);
  }

  #kick(player: Player, code?: number, data?: string) {
    player.state = ReadyState.KICKED;
    this.leave(player);
    player.close(code, data);
  }

  #onCreateRoom() {
    this.#game.stats.roomsCreated++;
  }

  #onDestroyRoom() {
    this.#game.stats.roomsDestroyed++;
  }

  #onPlayerJoin(player: Player) {
    this.#game.stats.playersJoined++;
    this.playersJoined++;
  }

  #onPlayerLeave(player: Player) {
    this.#game.stats.playersLeft++;
    this.playersLeft++;
  }

  #onFinishGame() {
    this.#game.stats.gamesCompleted++;
    this.gamesCompleted++;
    for (const player of this.players.values()) {
      if (!player.spectator) {
        player.gamesCompleted++;
        if (player.position === 1) {
          player.gamesWon++;
        }
      }
    }
  }

  #broadcast(message: ServerMessage) {
    for (const player of this.players.values()) {
      player.send(message);
    }
  }

  #makePlayerJoinMessage(player: Player): PlayerJoinMessage {
    const players = [...this.players.values()].map(({ id, user }) => ({
      id,
      user,
    }));
    return {
      type: PLAYER_JOIN_ID,
      joinedId: player.id,
      players,
    };
  }

  #makePlayerLeaveMessage(player: Player): PlayerLeaveMessage {
    const players = [...this.players.values()].map(({ id, user }) => ({
      id,
      user,
    }));
    return {
      type: PLAYER_LEAVE_ID,
      leftId: player.id,
      players,
    };
  }

  #makeGameConfigMessage(): GameConfigMessage {
    return {
      type: GAME_CONFIG_ID,
      text: this.#text,
    };
  }

  #makeGameReadyMessage(): GameReadyMessage {
    return {
      type: GAME_READY_ID,
      gameState: this.#gameState,
      countDown: this.#countDown,
    };
  }

  #makeGameWorldMessage(): GameWorldMessage {
    const elapsed = this.#elapsed();
    const playerState = new Map<number, PlayerState>();
    for (const player of this.players.values()) {
      playerState.set(player.id, {
        spectator: player.spectator,
        finished: player.finished,
        position: player.position,
        offset: player.offset,
        speed: player.speed,
        errors: player.errors,
      });
    }
    return {
      type: GAME_WORLD_ID,
      elapsed,
      playerState,
    };
  }

  toString() {
    return this.#id;
  }
}

function updatePlayer(player: Player, started: number) {
  const { pos, steps } = player.textInput;
  player.offset = pos;
  if (pos > 0) {
    const time = steps[pos - 1].timeStamp - started;
    player.speed = Math.round(computeSpeed(pos, time));
    player.errors = countErrors(steps);
  } else {
    player.speed = 0;
    player.errors = 0;
  }
}
