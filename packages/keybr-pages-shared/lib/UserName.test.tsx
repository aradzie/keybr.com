import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { Sitemap } from "./sitemap.ts";
import { type AnonymousUser, type NamedUser } from "./types.ts";
import { UserName } from "./UserName.tsx";

test.serial("render anonymous user", (t) => {
  const user: AnonymousUser = {
    id: null,
    name: "somebody",
    imageUrl: null,
  };

  const r = render(
    <FakeIntlProvider>
      <UserName user={user} link={Sitemap.accountLink(user)} />
    </FakeIntlProvider>,
  );

  t.not(r.queryByTitle("Anonymous User"), null);

  r.unmount();
});

test.serial("render named user", (t) => {
  const user: NamedUser = {
    id: "abc",
    name: "somebody",
    imageUrl: null,
    premium: false,
  };

  const r = render(
    <FakeIntlProvider>
      <UserName user={user} link={Sitemap.accountLink(user)} />
    </FakeIntlProvider>,
  );

  t.not(r.queryByTitle("somebody"), null);

  r.unmount();
});
