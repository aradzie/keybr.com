import { FakeIntlProvider } from "@keybr/intl";
import { Layout } from "@keybr/keyboard";
import { render } from "@testing-library/react";
import test from "ava";
import { MemoryRouter } from "react-router";
import { HighScoresTable } from "./HighScoresTable.tsx";
import { type Entry } from "./types.ts";

test.serial("render", (t) => {
  const r = render(
    <FakeIntlProvider>
      <MemoryRouter>
        <HighScoresTable
          entries={[
            {
              user: {
                id: null,
                name: "Deleted User",
                imageUrl: null,
              },
              layout: Layout.EN_US,
              speed: 750,
              score: 1000,
            } as Entry,
            {
              user: {
                id: "id",
                name: "Named User",
                imageUrl: null,
              },
              layout: Layout.EN_DVORAK,
              speed: 500,
              score: 500,
            } as Entry,
          ]}
        />
      </MemoryRouter>
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("Deleted User"), null);
  t.not(r.queryByText("Named User"), null);

  r.unmount();
});
