import { FakeIntlProvider } from "@keybr/intl";
import { PageDataContext } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { AccountPage } from "./AccountPage.tsx";

test.serial("render sign-in fragment", (t) => {
  const r = render(
    <PageDataContext.Provider
      value={{
        base: "https://www.keybr.com/",
        locale: "en",
        user: null,
        publicUser: {
          id: "xyz",
          name: "name",
          imageUrl: null,
          premium: false,
        },
        settings: null,
        prefs: null,
      }}
    >
      <FakeIntlProvider>
        <AccountPage />
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  t.not(r.queryByText("Anonymous User", { exact: false }), null);
  t.is(r.queryByText("You are using an account", { exact: false }), null);

  r.unmount();
});

test.serial("render account fragment", (t) => {
  const r = render(
    <PageDataContext.Provider
      value={{
        base: "https://www.keybr.com/",
        locale: "en",
        user: {
          id: "xzy",
          email: "name@keybr.com",
          name: "name",
          anonymized: false,
          externalId: [
            {
              provider: "custom",
              id: "externalId",
              name: "externalName",
              url: "externalUrl",
              imageUrl: "externalImageUrl",
              createdAt: "2001-02-03T04:05:06.789Z",
            },
          ],
          order: null,
          createdAt: "2001-02-03T04:05:06.789Z",
        },
        publicUser: {
          id: "xyz",
          name: "name",
          imageUrl: null,
          premium: false,
        },
        settings: null,
        prefs: null,
      }}
    >
      <FakeIntlProvider>
        <AccountPage />
      </FakeIntlProvider>
    </PageDataContext.Provider>,
  );

  t.is(r.queryByText("Anonymous User", { exact: false }), null);
  t.not(r.queryByText("You are using an account", { exact: false }), null);

  r.unmount();
});
