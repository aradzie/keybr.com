import { test } from "node:test";
import { Timer } from "@keybr/lang";
import { assert } from "chai";
import { createIntl } from "react-intl";
import {
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GameState,
  PLAYER_JOIN_ID,
  PLAYER_LEAVE_ID,
} from "./messages.ts";
import { player1, player2, player3 } from "./testing/data.ts";
import {
  handleTextInput,
  makeWorldState,
  NOBODY,
  updateWorldState,
} from "./worldstate.ts";

test("join and leave players", () => {
  const intl = createIntl({ locale: "en" });

  const state0 = makeWorldState(intl);

  // Initial state.

  assert.deepStrictEqual(state0.players, { all: [], me: NOBODY });

  // Few players join.

  const state1 = updateWorldState(intl, state0, {
    type: PLAYER_JOIN_ID,
    joinedId: player1.id,
    players: [player1, player2],
  });

  assert.notEqual(state0, state1);
  assert.deepStrictEqual(state1.players, {
    all: [player1, player2],
    me: player1,
  });

  // Few more players join.

  const state2 = updateWorldState(intl, state1, {
    type: PLAYER_JOIN_ID,
    joinedId: player3.id,
    players: [player1, player2, player3],
  });

  assert.notEqual(state1, state2);
  assert.deepStrictEqual(state2.players, {
    all: [player1, player2, player3],
    me: player1,
  });

  // Few players leave.

  const state3 = updateWorldState(intl, state2, {
    type: PLAYER_LEAVE_ID,
    leftId: player2.id,
    players: [player1, player3],
  });

  assert.notEqual(state2, state3);
  assert.deepStrictEqual(state3.players, {
    all: [player1, player3],
    me: player1,
  });

  // Few more leave.

  const state4 = updateWorldState(intl, state3, {
    type: PLAYER_LEAVE_ID,
    leftId: player3.id,
    players: [player1],
  });

  assert.notEqual(state3, state4);
  assert.deepStrictEqual(state4.players, { all: [player1], me: player1 });

  // Me leaves.

  const state5 = updateWorldState(intl, state4, {
    type: PLAYER_LEAVE_ID,
    leftId: player1.id,
    players: [],
  });

  // Final state.

  assert.notEqual(state4, state5);
  assert.deepStrictEqual(state5.players, { all: [], me: NOBODY });
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

  assert.strictEqual(state3.timer.elapsed, 200.5);
  assert.strictEqual(result?.elapsed, 200);
});
