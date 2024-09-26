import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { MemoryRouter } from "react-router";
import { UserName } from "./UserName.tsx";

test.serial("render anonymous user", (t) => {
  const r = render(
    <FakeIntlProvider>
      <MemoryRouter>
        <UserName
          user={{
            id: null,
            name: "somebody",
            imageUrl: null,
          }}
          path="/account"
        />
      </MemoryRouter>
    </FakeIntlProvider>,
  );

  t.not(r.queryByTitle("Anonymous User"), null);

  r.unmount();
});

test.serial("render named user", (t) => {
  const r = render(
    <FakeIntlProvider>
      <MemoryRouter>
        <UserName
          user={{
            id: "abc",
            name: "somebody",
            imageUrl: null,
            premium: false,
          }}
          path="/account"
        />
      </MemoryRouter>
    </FakeIntlProvider>,
  );

  t.not(r.queryByTitle("somebody"), null);

  r.unmount();
});
