import { test } from "node:test";
import { Timer } from "@keybr/lang";
import { createIntl } from "react-intl";
import { deepEqual, equal, notEqual } from "rich-assert";
import {
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  GameState,
  PLAYER_JOIN_ID,
  PLAYER_LEAVE_ID,
} from "./messages.ts";
import { player1, player2, player3 } from "./testing.ts";
import { type Player, type PlayerState, type WorldState } from "./types.ts";
import {
  handleTextInput,
  makeTextInput,
  makeWorldState,
  NOBODY,
  updateWorldState,
} from "./worldstate.ts";

test("join and leave players", () => {
  const intl = createIntl({ locale: "en" });

  const state0 = makeWorldState(intl);

  // Initial state.

  deepEqual(state0.players, { all: [], me: NOBODY });

  // Few players join.

  const state1 = updateWorldState(intl, state0, {
    type: PLAYER_JOIN_ID,
    joinedId: player1.id,
    players: [player1, player2],
  });

  notEqual(state0, state1);
  deepEqual(state1.players, {
    all: [player1, player2],
    me: player1,
  });

  // Few more players join.

  const state2 = updateWorldState(intl, state1, {
    type: PLAYER_JOIN_ID,
    joinedId: player3.id,
    players: [player1, player2, player3],
  });

  notEqual(state1, state2);
  deepEqual(state2.players, {
    all: [player1, player2, player3],
    me: player1,
  });

  // Few players leave.

  const state3 = updateWorldState(intl, state2, {
    type: PLAYER_LEAVE_ID,
    leftId: player2.id,
    players: [player1, player3],
  });

  notEqual(state2, state3);
  deepEqual(state3.players, {
    all: [player1, player3],
    me: player1,
  });

  // Few more leave.

  const state4 = updateWorldState(intl, state3, {
    type: PLAYER_LEAVE_ID,
    leftId: player3.id,
    players: [player1],
  });

  notEqual(state3, state4);
  deepEqual(state4.players, { all: [player1], me: player1 });

  // Me leaves.

  const state5 = updateWorldState(intl, state4, {
    type: PLAYER_LEAVE_ID,
    leftId: player1.id,
    players: [],
  });

  // Final state.

  notEqual(state4, state5);
  deepEqual(state5.players, { all: [], me: NOBODY });
});

test("update players", () => {
  Timer.now = () => 1000.0;

  const intl = createIntl({ locale: "en" });

  const textInput = makeTextInput("abc");
  const { lines } = textInput;

  // Initial state.

  const state0: WorldState = {
    gameState: GameState.RUNNING,
    players: {
      all: [player1, player2],
      me: player1,
    },
    textInput,
    lines,
    ticker: "",
    timer: new Timer(),
  };

  // Update state but do not change anything.

  const state1 = updateWorldState(intl, state0, {
    type: GAME_WORLD_ID,
    elapsed: 100,
    playerState: new Map([
      [player1.id, { ...player1 }],
      [player2.id, { ...player2 }],
    ]),
  });

  equal(state1.players.all[0], player1);
  equal(state1.players.all[1], player2);
  equal(state1.players.me, player1);

  // Update state and change players.

  const state2 = updateWorldState(intl, state1, {
    type: GAME_WORLD_ID,
    elapsed: 200,
    playerState: new Map([
      [
        player1.id,
        {
          spectator: true,
          finished: true,
          position: 1,
          offset: 3,
          speed: 200,
          errors: 1,
        } satisfies PlayerState,
      ],
      [
        player2.id,
        {
          spectator: false,
          finished: false,
          position: 2,
          offset: 1,
          speed: 100,
          errors: 0,
        } satisfies PlayerState,
      ],
    ]),
  });

  notEqual(state2.players.all[0], player1);
  notEqual(state2.players.all[1], player2);
  deepEqual(state2.players.all[0], {
    ...player1,
    spectator: true,
    finished: true,
    position: 1,
    offset: 3,
    speed: 200,
    errors: 1,
    progress: 1.0,
  } satisfies Player);
  deepEqual(state2.players.all[1], {
    ...player2,
    spectator: false,
    finished: false,
    position: 2,
    offset: 1,
    speed: 100,
    errors: 0,
    progress: 0.3333333333333333,
  } satisfies Player);
});

test("handle text input", () => {
  Timer.now = () => 1000.0;

  const intl = createIntl({ locale: "en" });

  const state0 = makeWorldState(intl);

  const state1 = updateWorldState(intl, state0, {
    type: PLAYER_JOIN_ID,
    joinedId: player1.id,
    players: [player1, player2, player3],
  });

  const state2 = updateWorldState(intl, state1, {
    type: GAME_CONFIG_ID,
    text: "abc",
  });

  const state3 = updateWorldState(intl, state2, {
    type: GAME_READY_ID,
    countDown: 0,
    gameState: GameState.RUNNING,
  });

  Timer.now = () => 1200.5;

  const result = handleTextInput(state3, /* "a" */ 0x0061);

  equal(state3.timer.elapsed, 200.5);
  equal(result?.elapsed, 200);
});
