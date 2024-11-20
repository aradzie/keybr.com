import { test } from "node:test";
import { Timer } from "@keybr/lang";
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
import { deepEqual, equal } from "rich-assert";
import { Game } from "./game.ts";
import { Player } from "./player.ts";
import { Room } from "./room.ts";
import { FakeSession } from "./testing.ts";

Room.nextQuote = () => "abc";

test("join and start", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  Timer.now = () => 0;

  const game = new Game();
  const room = new Room(game, 1);

  const session0 = new FakeSession();
  const session1 = new FakeSession();
  const player0 = new Player(session0, 1);
  const player1 = new Player(session1, 2);

  player0.join(room);
  player0.onMessage({ type: PLAYER_ANNOUNCE_ID, signature: 0xdeadbabe });
  ctx.mock.timers.runAll();
  equal(player0.room, room);
  equal(player1.room, null);

  player1.join(room);
  player1.onMessage({ type: PLAYER_ANNOUNCE_ID, signature: 0xdeadbabe });
  ctx.mock.timers.runAll();
  deepEqual(session0.take(), [
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
            } satisfies AnonymousUser,
          },
        ],
      } satisfies PlayerJoinMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.WAITING,
        countDown: 0,
      } satisfies GameReadyMessage,
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
            } satisfies AnonymousUser,
          },
          {
            id: 2,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } satisfies AnonymousUser,
          },
        ],
      } satisfies PlayerJoinMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_CONFIG_ID,
        text: "abc",
      } satisfies GameConfigMessage,
    },
  ]);
  deepEqual(session1.take(), [
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
            } satisfies AnonymousUser,
          },
          {
            id: 2,
            user: {
              id: null,
              name: "player name",
              imageUrl: null,
            } satisfies AnonymousUser,
          },
        ],
      } satisfies PlayerJoinMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.WAITING,
        countDown: 0,
      } satisfies GameReadyMessage,
    },
    {
      op: "send",
      message: {
        type: GAME_CONFIG_ID,
        text: "abc",
      } satisfies GameConfigMessage,
    },
  ]);

  ctx.mock.timers.runAll();
  deepEqual(session0.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 3,
      } satisfies GameReadyMessage,
    },
  ]);
  deepEqual(session1.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 3,
      } satisfies GameReadyMessage,
    },
  ]);

  ctx.mock.timers.runAll();
  deepEqual(session0.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 2,
      } satisfies GameReadyMessage,
    },
  ]);
  deepEqual(session1.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 2,
      } satisfies GameReadyMessage,
    },
  ]);

  ctx.mock.timers.runAll();
  deepEqual(session0.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 1,
      } satisfies GameReadyMessage,
    },
  ]);
  deepEqual(session1.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.STARTING,
        countDown: 1,
      } satisfies GameReadyMessage,
    },
  ]);

  ctx.mock.timers.runAll();
  deepEqual(session0.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.RUNNING,
        countDown: 0,
      } satisfies GameReadyMessage,
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
            } satisfies PlayerState,
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
            } satisfies PlayerState,
          ],
        ]),
      } satisfies GameWorldMessage,
    },
  ]);
  deepEqual(session1.take(), [
    {
      op: "send",
      message: {
        type: GAME_READY_ID,
        gameState: GameState.RUNNING,
        countDown: 0,
      } satisfies GameReadyMessage,
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
            } satisfies PlayerState,
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
            } satisfies PlayerState,
          ],
        ]),
      } satisfies GameWorldMessage,
    },
  ]);

  equal(player0.room, room);
  equal(player1.room, room);
});

test("join and leave", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout", "setInterval"] });

  Timer.now = () => 0;

  const game = new Game();
  const room0 = new Room(game, 1);
  const room1 = new Room(game, 2);
  const session0 = new FakeSession();
  const session1 = new FakeSession();
  const player0 = new Player(session0, 1);
  const player1 = new Player(session1, 2);

  equal(player0.room, null);
  equal(player1.room, null);

  // Player 0 joins room 0.
  player0.join(room0);
  ctx.mock.timers.runAll();
  equal(player0.room, room0);
  equal(player1.room, null);

  // Repeat again.
  player0.join(room0);
  ctx.mock.timers.runAll();
  equal(player0.room, room0);
  equal(player1.room, null);

  // Player 1 joins room 0.
  room0.join(player1);
  ctx.mock.timers.runAll();
  equal(player0.room, room0);
  equal(player1.room, room0);

  // Repeat again.
  room0.join(player1);
  ctx.mock.timers.runAll();
  equal(player0.room, room0);
  equal(player1.room, room0);

  // Joint another room.
  room1.join(player1);
  ctx.mock.timers.runAll();
  equal(player0.room, room0);
  equal(player1.room, room1);

  room0.destroy();
  room1.destroy();
});
