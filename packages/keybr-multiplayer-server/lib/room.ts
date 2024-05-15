import assert from "node:assert";
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
import { computeSpeed } from "@keybr/textinput";
import { type Task, Tasks, Timer } from "@keybr/timer";
import { type Game } from "./game.ts";
import { type Player, ReadyState } from "./player.ts";
import { Services } from "./services.ts";

export class Room {
  readonly #game: Game;
  readonly #id: number;
  readonly #roomSize: number = 5;
  readonly #tasks = new Tasks();
  readonly players = new Map<number, Player>(); // TODO Make private?
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

  destroy(): void {
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

  canJoin(): boolean {
    return this.players.size < this.#roomSize;
  }

  join(player: Player): void {
    if (this.players.has(player.id)) {
      return;
    }
    this.players.set(player.id, player);
    player.join(this);
  }

  #completeJoin(player: Player, message: PlayerAnnounceMessage): void {
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

  leave(player: Player): void {
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

  kickIdlePlayers(): void {
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

  onPlayerMessage(player: Player, message: ClientMessage): void {
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

  #onPlayerProgress(player: Player, message: PlayerProgressMessage): void {
    const now = Timer.now();
    player.lastActivity = now;
    if (this.#gameState === GameState.RUNNING) {
      if (!player.spectator && !player.finished) {
        player.lastInput = now;
        player.textInput.appendChar(message.codePoint, now);
        updatePlayer(player, this.#started);
        if (player.offset === this.#text.length) {
          player.finished = true;
          player.position = this.#finishOrder++;
        }
        this.#updatePlayerPositions();
        this.#broadcast(this.#makeGameWorldMessage());
        this.#maybeFinishGame();
      }
    }
  }

  #updatePlayerPositions(): void {
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

  #waitForPlayers(): void {
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

  #scheduleNewGame(): void {
    if (this.#startTask != null) {
      this.#startTask.cancel();
      this.#startTask = null;
    }
    this.#startTask = this.#tasks.delayed(3000, () => {
      this.#startTask = null;
      if (this.players.size > 1) {
        this.#gameState = GameState.STARTING;
        this.#countDown = 3;
        this.#text = Services.nextQuote();
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

  #startStep(): void {
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

  #maybeFinishGame(): void {
    assert(this.#gameState === GameState.RUNNING);
    if (this.#isFinished()) {
      this.#finishGame();
    }
  }

  #finishGame(): void {
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

  #elapsed(): number {
    assert(this.#gameState === GameState.RUNNING);
    return Timer.now() - this.#started;
  }

  #kick(player: Player, code?: number, data?: string): void {
    player.state = ReadyState.KICKED;
    this.leave(player);
    player.close(code, data);
  }

  #onCreateRoom(): void {
    this.#game.stats.roomsCreated++;
  }

  #onDestroyRoom(): void {
    this.#game.stats.roomsDestroyed++;
  }

  #onPlayerJoin(player: Player): void {
    this.#game.stats.playersJoined++;
    this.playersJoined++;
  }

  #onPlayerLeave(player: Player) {
    this.#game.stats.playersLeft++;
    this.playersLeft++;
  }

  #onFinishGame(): void {
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

  #broadcast(message: ServerMessage): void {
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
}

function updatePlayer(player: Player, started: number): void {
  const steps = player.textInput.getSteps();
  const { length } = steps;
  player.offset = length;
  if (length < 1) {
    player.speed = 0;
    player.errors = 0;
  } else {
    const time = steps[length - 1].timeStamp - started;
    const speed = Math.round(computeSpeed(length, time));
    let errors = 0;
    for (const step of steps) {
      if (step.typo) {
        errors += 1;
      }
    }
    player.speed = speed;
    player.errors = errors;
  }
}
