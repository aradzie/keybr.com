import { FakeIntlProvider } from "@keybr/intl";
import {
  type AnyUser,
  PageDataContext,
  type UserDetails,
} from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { AccountApp } from "./AccountApp.tsx";

const user: UserDetails = {
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
};

const publicUser: AnyUser = {
  id: "xyz",
  name: "name",
  imageUrl: null,
  premium: false,
};

test.serial("render sign-in fragment", (t) => {
  const r = render(
    <FakeIntlProvider>
      <PageDataContext.Provider
        value={{
          base: "https://www.keybr.com/",
          locale: "en",
          user: null,
          publicUser,
          settings: null,
          prefs: null,
          extra: {},
        }}
      >
        <AccountApp />
      </PageDataContext.Provider>
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("Anonymous User", { exact: false }), null);
  t.is(r.queryByText("You are using an account", { exact: false }), null);

  r.unmount();
});

test.serial("render account fragment", (t) => {
  const r = render(
    <FakeIntlProvider>
      <PageDataContext.Provider
        value={{
          base: "https://www.keybr.com/",
          locale: "en",
          user,
          publicUser,
          settings: null,
          prefs: null,
          extra: {},
        }}
      >
        <AccountApp />
      </PageDataContext.Provider>
    </FakeIntlProvider>,
  );

  t.is(r.queryByText("Anonymous User", { exact: false }), null);
  t.not(r.queryByText("You are using an account", { exact: false }), null);

  r.unmount();
});
