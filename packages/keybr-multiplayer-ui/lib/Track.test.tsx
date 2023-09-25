import { FakeIntlProvider } from "@keybr/intl";
import { NOBODY } from "@keybr/multiplayer-shared";
import {
  player1,
  player2,
  player3,
} from "@keybr/multiplayer-shared/lib/testing/data.ts";
import { act, render } from "@testing-library/react";
import test from "ava";
import { DeferredTrack, Track } from "./Track.tsx";

declare function flushAnimationFrames(): Promise<void>;

test.serial("render", (t) => {
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

  t.not(r.queryByText("abc"), null);
  t.is(r.queryByText("name1"), null);
  t.is(r.queryByText("name2"), null);

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

  t.not(r.queryByText("xyz"), null);
  t.not(r.queryByText("name1"), null);
  t.not(r.queryByText("name2"), null);

  r.unmount();
});

test.serial("deferred render", async (t) => {
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

  t.not(r.queryByText("abc"), null);
  t.is(r.queryByText("name1"), null);
  t.is(r.queryByText("name2"), null);

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

  t.not(r.queryByText("abc"), null);
  t.is(r.queryByText("name1"), null);
  t.is(r.queryByText("name2"), null);

  await act(async () => {
    await flushAnimationFrames();
  });

  t.not(r.queryByText("xyz"), null);
  t.not(r.queryByText("name1"), null);
  t.not(r.queryByText("name2"), null);

  r.unmount();
});
