import { FakeIntlProvider } from "@keybr/intl";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { Sitemap } from "./sitemap.ts";
import { type AnonymousUser, type NamedUser } from "./types.ts";
import { UserName } from "./UserName.tsx";

test("render anonymous user", (t) => {
  const user: AnonymousUser = {
    id: null,
    name: "somebody",
    imageUrl: null,
  };

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <UserName user={user} link={Sitemap.accountLink(user)} />
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render named user", (t) => {
  const user: NamedUser = {
    id: "abc",
    name: "somebody",
    imageUrl: null,
    premium: false,
  };

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <UserName user={user} link={Sitemap.accountLink(user)} />
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});
