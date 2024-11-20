import { test } from "node:test";
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
} from "@keybr/multiplayer-shared/lib/testing.ts";
import { FakeSettingsContext } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import { doesNotInclude, includes, isNotNull, isNull } from "rich-assert";
import { Game } from "./Game.tsx";
import { FakeTransport } from "./transport.fake.ts";

declare function flushAnimationFrames(): Promise<void>;

test("initial state", async () => {
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

  includes(r.container.textContent!, "Initializing...");

  r.unmount();
});

test("game config", async () => {
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

  doesNotInclude(r.container.textContent!, "abracadabra");

  act(() => {
    transport.transmit({
      type: GAME_CONFIG_ID,
      text: "abracadabra",
    });
  });

  await act(async () => {
    await flushAnimationFrames();
  });

  includes(r.container.textContent!, "abracadabra");

  r.unmount();
});

test("players join and leave", async () => {
  const transport = new FakeTransport<ServerMessage, ClientMessage>();

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Game transport={transport} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  isNull(r.queryByText(player1.user.name));
  isNull(r.queryByText(player2.user.name));
  isNull(r.queryByText(player3.user.name));

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

  isNotNull(r.queryByText(player1.user.name));
  isNotNull(r.queryByText(player2.user.name));
  isNotNull(r.queryByText(player3.user.name));

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

  isNotNull(r.queryByText(player1.user.name));
  isNotNull(r.queryByText(player2.user.name));
  isNull(r.queryByText(player3.user.name));

  r.unmount();
});

test("all together", async () => {
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

  includes(r.container.textContent!, "Initializing...");

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

  includes(r.container.textContent!, "Start in 2");

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

  includes(r.container.textContent!, "Start in 1");

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

  includes(r.container.textContent!, "Race started!");

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

  includes(r.container.textContent!, "Zzz... Wait for the next race");

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

  includes(r.container.textContent!, "You finished 3rd!");

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

  includes(r.container.textContent!, "You finished 2nd!");

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

  includes(r.container.textContent!, "You won the race!");

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

  includes(r.container.textContent!, "GO!");

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

  includes(r.container.textContent!, "Race finished!");

  r.unmount();
});
