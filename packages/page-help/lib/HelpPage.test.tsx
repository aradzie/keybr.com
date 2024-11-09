import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { MemoryRouter } from "react-router";
import { HelpPage } from "./HelpPage.tsx";

test("render", () => {
  const r = render(
    <FakeIntlProvider>
      <MemoryRouter>
        <FakeSettingsContext>
          <HelpPage />
        </FakeSettingsContext>
      </MemoryRouter>
    </FakeIntlProvider>,
  );

  assert.isNotNull(r.queryByText("Learn to type faster"));

  r.unmount();
});
