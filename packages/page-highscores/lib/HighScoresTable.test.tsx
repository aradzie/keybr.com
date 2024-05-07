import { FakeIntlProvider } from "@keybr/intl";
import { Layout } from "@keybr/keyboard";
import { type AnonymousUser, type NamedUser } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { HighScoresTable } from "./HighScoresTable.tsx";
import { type HighScoresEntry } from "./model.ts";

test.serial("render", (t) => {
  const entries: HighScoresEntry[] = [
    {
      user: {
        id: null,
        name: "somebody",
        imageUrl: null,
      } as AnonymousUser,
      layout: Layout.EN_US,
      speed: 750,
      score: 1000,
    },
    {
      user: {
        id: "user id",
        name: "user name",
        imageUrl: "image url",
      } as NamedUser,
      layout: Layout.EN_DVORAK,
      speed: 500,
      score: 500,
    },
  ];

  const r = render(
    <FakeIntlProvider>
      <HighScoresTable entries={entries} />
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("user name"), null);

  r.unmount();
});
