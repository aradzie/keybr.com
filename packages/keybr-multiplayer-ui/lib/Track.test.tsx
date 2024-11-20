import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { NOBODY } from "@keybr/multiplayer-shared";
import {
  player1,
  player2,
  player3,
} from "@keybr/multiplayer-shared/lib/testing.ts";
import { act, render } from "@testing-library/react";
import { isNotNull, isNull } from "rich-assert";
import { DeferredTrack, Track } from "./Track.tsx";

declare function flushAnimationFrames(): Promise<void>;

test("render", () => {
  const r = render(
    <FakeIntlProvider>
      <Track
        ticker="abc"
        players={{
          all: [],
          me: NOBODY,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByText("abc"));
  isNull(r.queryByText("name1"));
  isNull(r.queryByText("name2"));

  r.rerender(
    <FakeIntlProvider>
      <Track
        ticker="xyz"
        players={{
          all: [player1, player2, player3],
          me: player1,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByText("xyz"));
  isNotNull(r.queryByText("name1"));
  isNotNull(r.queryByText("name2"));

  r.unmount();
});

test("deferred render", async () => {
  const r = render(
    <FakeIntlProvider>
      <DeferredTrack
        ticker="abc"
        players={{
          all: [],
          me: NOBODY,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByText("abc"));
  isNull(r.queryByText("name1"));
  isNull(r.queryByText("name2"));

  r.rerender(
    <FakeIntlProvider>
      <DeferredTrack
        ticker="xyz"
        players={{
          all: [player1, player2, player3],
          me: player1,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByText("abc"));
  isNull(r.queryByText("name1"));
  isNull(r.queryByText("name2"));

  await act(async () => {
    await flushAnimationFrames();
  });

  isNotNull(r.queryByText("xyz"));
  isNotNull(r.queryByText("name1"));
  isNotNull(r.queryByText("name2"));

  r.unmount();
});
