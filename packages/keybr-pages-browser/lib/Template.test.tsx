import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { MemoryRouter } from "react-router";
import { Template } from "./Template.tsx";

test("render", () => {
  const r = render(
    <PageDataContext.Provider
      value={{
        base: "https://www.keybr.com/",
        locale: "en",
        user: null,
        publicUser: {
          id: null,
          name: "name",
          imageUrl: null,
        },
        settings: null,
      }}
    >
      <FakeIntlProvider>
        <MemoryRouter>
          <Template path="/page">
            <div>hello</div>
          </Template>
        </MemoryRouter>
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  assert.isNotNull(r.queryByText("hello"));

  r.unmount();
});

test("render alt", () => {
  const r = render(
    <PageDataContext.Provider
      value={{
        base: "https://www.keybr.com/",
        locale: "en",
        user: null,
        publicUser: {
          id: "abc",
          name: "name",
          imageUrl: null,
          premium: true,
        },
        settings: null,
      }}
    >
      <FakeIntlProvider>
        <MemoryRouter>
          <Template path="/page">
            <div>hello</div>
          </Template>
        </MemoryRouter>
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  assert.isNotNull(r.queryByText("hello"));

  r.unmount();
});
