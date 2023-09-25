import test from "ava";
import { createIntl } from "react-intl";
import { PLAYER_JOIN_ID, PLAYER_LEAVE_ID } from "./messages.ts";
import { player1, player2, player3 } from "./testing/data.ts";
import { makeWorldState, NOBODY, updateWorldState } from "./worldstate.ts";

test("join and leave players", (t) => {
  const intl = createIntl({ locale: "en" });

  const state0 = makeWorldState(intl);

  // Initial state.

  t.deepEqual(state0.players, { all: [], me: NOBODY });

  // Few players join.

  const state1 = updateWorldState(intl, state0, {
    type: PLAYER_JOIN_ID,
    joinedId: player1.id,
    players: [player1, player2],
  });

  t.not(state0, state1);
  t.deepEqual(state1.players, { all: [player1, player2], me: player1 });

  // Few more players join.

  const state2 = updateWorldState(intl, state1, {
    type: PLAYER_JOIN_ID,
    joinedId: player3.id,
    players: [player1, player2, player3],
  });

  t.not(state1, state2);
  t.deepEqual(state2.players, {
    all: [player1, player2, player3],
    me: player1,
  });

  // Few players leave.

  const state3 = updateWorldState(intl, state2, {
    type: PLAYER_LEAVE_ID,
    leftId: player2.id,
    players: [player1, player3],
  });

  t.not(state2, state3);
  t.deepEqual(state3.players, { all: [player1, player3], me: player1 });

  // Few more leave.

  const state4 = updateWorldState(intl, state3, {
    type: PLAYER_LEAVE_ID,
    leftId: player3.id,
    players: [player1],
  });

  t.not(state3, state4);
  t.deepEqual(state4.players, { all: [player1], me: player1 });

  // Me leaves.

  const state5 = updateWorldState(intl, state4, {
    type: PLAYER_LEAVE_ID,
    leftId: player1.id,
    players: [],
  });

  // Final state.

  t.not(state4, state5);
  t.deepEqual(state5.players, { all: [], me: NOBODY });
});
