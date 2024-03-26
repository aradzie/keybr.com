import {
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  type GameConfigMessage,
  type GameReadyMessage,
  GameState,
  type GameWorldMessage,
  PLAYER_ANNOUNCE_ID,
  PLAYER_JOIN_ID,
  type PlayerJoinMessage,
  type PlayerState,
} from "@keybr/multiplayer-shared";
import { type AnonymousUser } from "@keybr/pages-shared";
import { fake } from "@keybr/test-env-time";
import { Timer } from "@keybr/timer";
import test from "ava";
import { Game } from "./game.ts";
import { Player } from "./player.ts";
import { Room } from "./room.ts";
import { Services } from "./services.ts";
import { FakeSession } from "./testing/fake-session.ts";

test.beforeEach(() => {
  fake.timers.set();
  Timer.now = () => 0;
});

test.afterEach(() => {
  fake.timers.reset();
  Timer.now = () => 0;
});

Services.nextQuote = () => "text fragment";

test.serial("join and start", async (t) => {
  const game = new Game();
  const room = new Room(game, 1);

  const session0 = new FakeSession();
  const session1 = new FakeSession();
  const player0 = new Player(session0, 1);
  const player1 = new Player(session1, 2);

  player0.join(room);
  player0.onMessage({ type: PLAYER_ANNOUNCE_ID, signature: 0xdeadbabe });
  await fake.timers.run();
  t.is(player0.room, room);
  t.is(player1.room, null);

  player1.join(room);
  player1.onMessage({ type: PLAYER_ANNOUNCE_ID, signature: 0xdeadbabe });
  await fake.timers.run();
  t.is(player0.room, room);
  t.is(player1.room, room);

  t.deepEqual(session0.take(), [
    {
      op: "send",
      message: {
        type: PLAYER_JOIN_ID,
        joinedId: 1,
        players: [
          {
            id: 1,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } as AnonymousUser,
          },
        ],
      } as PlayerJoinMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.WAITING,
        countDown: 0,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: PLAYER_JOIN_ID,
        joinedId: 2,
        players: [
          {
            id: 1,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } as AnonymousUser,
          },
          {
            id: 2,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } as AnonymousUser,
          },
        ],
      } as PlayerJoinMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_CONFIG_ID,
        text: "text fragment",
      } as GameConfigMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 3,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 2,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 1,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.RUNNING,
        countDown: 0,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_WORLD_ID,
        elapsed: 0,
        playerState: new Map([
          [
            1,
            {
              spectator: false,
              finished: false,
              position: 0,
              offset: 0,
              speed: 0,
              errors: 0,
            } as PlayerState,
          ],
          [
            2,
            {
              spectator: false,
              finished: false,
              position: 0,
              offset: 0,
              speed: 0,
              errors: 0,
            } as PlayerState,
          ],
        ]),
      } as GameWorldMessage,
    },
  ]);
  t.deepEqual(session1.take(), [
    {
      op: "send",
      message: {
        type: PLAYER_JOIN_ID,
        joinedId: 2,
        players: [
          {
            id: 1,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } as AnonymousUser,
          },
          {
            id: 2,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } as AnonymousUser,
          },
        ],
      } as PlayerJoinMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.WAITING,
        countDown: 0,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_CONFIG_ID,
        text: "text fragment",
      } as GameConfigMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 3,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 2,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 1,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.RUNNING,
        countDown: 0,
      } as GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_WORLD_ID,
        elapsed: 0,
        playerState: new Map([
          [
            1,
            {
              spectator: false,
              finished: false,
              position: 0,
              offset: 0,
              speed: 0,
              errors: 0,
            } as PlayerState,
          ],
          [
            2,
            {
              spectator: false,
              finished: false,
              position: 0,
              offset: 0,
              speed: 0,
              errors: 0,
            } as PlayerState,
          ],
        ]),
      } as GameWorldMessage,
    },
  ]);
});

test.serial("join and leave", async (t) => {
  const game = new Game();
  const room0 = new Room(game, 1);
  const room1 = new Room(game, 2);
  const session0 = new FakeSession();
  const session1 = new FakeSession();
  const player0 = new Player(session0, 1);
  const player1 = new Player(session1, 2);

  t.is(player0.room, null);
  t.is(player1.room, null);

  // Player 0 joins room 0.
  player0.join(room0);
  await fake.timers.run();
  t.is(player0.room, room0);
  t.is(player1.room, null);

  // Repeat again.
  player0.join(room0);
  await fake.timers.run();
  t.is(player0.room, room0);
  t.is(player1.room, null);

  // Player 1 joins room 0.
  room0.join(player1);
  await fake.timers.run();
  t.is(player0.room, room0);
  t.is(player1.room, room0);

  // Repeat again.
  room0.join(player1);
  await fake.timers.run();
  t.is(player0.room, room0);
  t.is(player1.room, room0);

  // Joint another room.
  room1.join(player1);
  await fake.timers.run();
  t.is(player0.room, room0);
  t.is(player1.room, room1);

  room0.destroy();
  room1.destroy();
});
