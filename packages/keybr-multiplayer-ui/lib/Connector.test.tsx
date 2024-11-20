import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { PLAYER_KICKED } from "@keybr/multiplayer-shared";
import { FakeSettingsContext } from "@keybr/settings";
import { act, render } from "@testing-library/react";
import { includes } from "rich-assert";
import { Connector } from "./Connector.tsx";
import { FakeWebSocket } from "./websocket.fake.ts";
import { useWebSocket } from "./websocket-hooks.ts";

test("handle websocket ready state changes", () => {
  const webSocket = new FakeWebSocket("wss://www.keybr.com/game");

  useWebSocket.makeWebSocket = () => webSocket;

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Connector />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  includes(r.getByRole("heading").textContent!, "Connecting to Server...");

  act(() => {
    webSocket.serverConnect();
  });
  act(() => {
    webSocket.serverClose(PLAYER_KICKED);
  });

  includes(r.getByRole("heading").textContent!, "Kicked out of the Game");

  r.unmount();
});
