import { FakeIntlProvider } from "@keybr/intl";
import { Layout } from "@keybr/keyboard";
import { type AnonymousUser, type NamedUser } from "@keybr/pages-shared";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { HighScoresTable } from "./HighScoresTable.tsx";
import { type HighScoresEntry } from "./model.ts";

test("render", (t) => {
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

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <HighScoresTable entries={entries} />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
