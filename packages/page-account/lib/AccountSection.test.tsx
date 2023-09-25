import { FakeIntlProvider } from "@keybr/intl";
import { type AnyUser, type UserDetails } from "@keybr/pages-shared";
import { render } from "@testing-library/react";
import test from "ava";
import { AccountSection } from "./AccountSection.tsx";

const user: UserDetails = {
  id: "xzy",
  email: "name@keybr.com",
  name: "unique user name",
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
  name: "unique user name",
  imageUrl: null,
  premium: false,
};

test.serial("render", (t) => {
  const r = render(
    <FakeIntlProvider>
      <AccountSection user={user} publicUser={publicUser} />
    </FakeIntlProvider>,
  );

  t.not(r.queryByText("unique user name"), null);

  r.unmount();
});
