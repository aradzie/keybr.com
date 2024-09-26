import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { MemoryRouter } from "react-router";
import { HelpPage } from "./HelpPage.tsx";

test.serial("render", (t) => {
  const r = render(
    <FakeIntlProvider>
      <MemoryRouter>
        <HelpPage />
      </MemoryRouter>
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("Learn to type faster"), null);

  r.unmount();
});
