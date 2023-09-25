import { FakeIntlProvider } from "@keybr/intl";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { Avatar } from "./Avatar.tsx";
import { type AnonymousUser, type NamedUser } from "./types.ts";

test("render anonymous user without image", (t) => {
  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <Avatar user={null} />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render anonymous user with identicon", (t) => {
  const user: AnonymousUser = {
    id: null,
    name: "somebody",
    imageUrl: null,
  };

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <Avatar user={user} />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render named user with identicon", (t) => {
  const user: NamedUser = {
    id: "id",
    name: "somebody",
    imageUrl: null,
    premium: false,
  };

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <Avatar user={user} />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render named user with custom image", (t) => {
  const user: NamedUser = {
    id: "id",
    name: "somebody",
    imageUrl: "https://provider.com/image.png",
    premium: false,
  };

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <Avatar user={user} />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
