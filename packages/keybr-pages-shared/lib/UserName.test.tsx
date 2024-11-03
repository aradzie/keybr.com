import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { MemoryRouter } from "react-router";
import { UserName } from "./UserName.tsx";

test("render anonymous user", () => {
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

  assert.isNotNull(r.queryByTitle("Anonymous User"));

  r.unmount();
});

test("render named user", () => {
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

  assert.isNotNull(r.queryByTitle("somebody"));

  r.unmount();
});
