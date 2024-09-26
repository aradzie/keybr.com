import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { MemoryRouter } from "react-router";
import { Template } from "./Template.tsx";

test("render", (t) => {
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
        prefs: {
          color: "light",
          font: "opensans",
        },
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

  t.not(r.queryByText("hello"), null);

  r.unmount();
});

test("render alt", (t) => {
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
        prefs: {
          color: "light",
          font: "opensans",
        },
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

  t.not(r.queryByText("hello"), null);

  r.unmount();
});
