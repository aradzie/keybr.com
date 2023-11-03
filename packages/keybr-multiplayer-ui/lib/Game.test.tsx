import { FakeIntlProvider } from "@keybr/intl";
import {
  type ClientMessage,
  GAME_CONFIG_ID,
  GAME_READY_ID,
  GAME_WORLD_ID,
  GameState,
  PLAYER_JOIN_ID,
  PLAYER_LEAVE_ID,
  type ServerMessage,
} from "@keybr/multiplayer-shared";
import {
  player1,
  player2,
  player3,
} from "@keybr/multiplayer-shared/lib/testing/data.ts";
import { FakeSettingsContext } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import test from "ava";
import { Game } from "./Game.tsx";
import { FakeTransport } from "./transport.fake.ts";

declare function flushAnimationFrames(): Promise<void>;

test.serial("initial state", async (t) => {
  const transport = new FakeTransport<ServerMessage, ClientMessage>();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Game transport={transport} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  await act(async () => {
    await flushAnimationFrames();
  });

  t.not(r.queryByText("Initializing..."), null);

  r.unmount();
});

test.serial("game config", async (t) => {
  const transport = new FakeTransport<ServerMessage, ClientMessage>();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Game transport={transport} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  await act(async () => {
    await flushAnimationFrames();
  });

  t.false(r.container.textContent?.includes("abracadabra"));

  act(() => {
    transport.transmit({
      type: GAME_CONFIG_ID,
      text: "abracadabra",
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.container.textContent?.includes("abracadabra"));

  r.unmount();
});

test.serial("players join and leave", async (t) => {
  const transport = new FakeTransport<ServerMessage, ClientMessage>();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Game transport={transport} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  t.true(r.queryByText(player1.user.name) == null);
  t.true(r.queryByText(player2.user.name) == null);
  t.true(r.queryByText(player3.user.name) == null);

  act(() => {
    transport.transmit({
      type: PLAYER_JOIN_ID,
      joinedId: player1.id,
      players: [player1, player2, player3],
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText(player1.user.name) != null);
  t.true(r.queryByText(player2.user.name) != null);
  t.true(r.queryByText(player3.user.name) != null);

  act(() => {
    transport.transmit({
      type: PLAYER_LEAVE_ID,
      leftId: player3.id,
      players: [player1, player2],
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText(player1.user.name) != null);
  t.true(r.queryByText(player2.user.name) != null);
  t.true(r.queryByText(player3.user.name) == null);

  r.unmount();
});

test.serial("all together", async (t) => {
  const transport = new FakeTransport<ServerMessage, ClientMessage>();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Game transport={transport} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  act(() => {
    transport.transmit({
      type: GAME_CONFIG_ID,
      text: "text fragment",
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  act(() => {
    transport.transmit({
      type: PLAYER_JOIN_ID,
      joinedId: player1.id,
      players: [player1, player2, player3],
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("Initializing...") != null);

  act(() => {
    transport.transmit({
      type: GAME_READY_ID,
      gameState: GameState.STARTING,
      countDown: 2,
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("Start in 2") != null);

  act(() => {
    transport.transmit({
      type: GAME_READY_ID,
      gameState: GameState.STARTING,
      countDown: 1,
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("Start in 1") != null);

  act(() => {
    transport.transmit({
      type: GAME_READY_ID,
      gameState: GameState.RUNNING,
      countDown: 0,
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("Race started!") != null);

  act(() => {
    transport.transmit({
      type: GAME_WORLD_ID,
      elapsed: 1000,
      playerState: new Map([
        [
          player1.id,
          {
            spectator: true,
            finished: false,
            position: 0,
            offset: 0,
            speed: 0,
            errors: 0,
          },
        ],
      ]),
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("Zzz... Wait for the next race") != null);

  act(() => {
    transport.transmit({
      type: GAME_WORLD_ID,
      elapsed: 1000,
      playerState: new Map([
        [
          player1.id,
          {
            spectator: false,
            finished: true,
            position: 3,
            offset: 10,
            speed: 100,
            errors: 1,
          },
        ],
      ]),
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("You finished 3rd!") != null);

  act(() => {
    transport.transmit({
      type: GAME_WORLD_ID,
      elapsed: 1000,
      playerState: new Map([
        [
          player1.id,
          {
            spectator: false,
            finished: true,
            position: 2,
            offset: 10,
            speed: 100,
            errors: 1,
          },
        ],
      ]),
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("You finished 2nd!") != null);

  act(() => {
    transport.transmit({
      type: GAME_WORLD_ID,
      elapsed: 1000,
      playerState: new Map([
        [
          player1.id,
          {
            spectator: false,
            finished: true,
            position: 1,
            offset: 10,
            speed: 100,
            errors: 1,
          },
        ],
      ]),
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("You won the race!") != null);

  act(() => {
    transport.transmit({
      type: GAME_WORLD_ID,
      elapsed: 1000,
      playerState: new Map([
        [
          player1.id,
          {
            spectator: false,
            finished: false,
            position: 5,
            offset: 10,
            speed: 100,
            errors: 1,
          },
        ],
      ]),
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("GO!") != null);

  act(() => {
    transport.transmit({
      type: GAME_READY_ID,
      gameState: GameState.FINISHED,
      countDown: 0,
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  t.true(r.queryByText("Race finished!") != null);

  r.unmount();
});
