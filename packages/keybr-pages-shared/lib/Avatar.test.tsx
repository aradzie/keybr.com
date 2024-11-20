import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import { isNotNull } from "rich-assert";
import { Avatar } from "./Avatar.tsx";

test("render anonymous user without image", () => {
  const r = render(
    <FakeIntlProvider>
      <Avatar user={null} />
    </FakeIntlProvider>,
  );

  isNotNull(r.container.querySelector(".root"));

  r.unmount();
});

test("render anonymous user with identicon", () => {
  const r = render(
    <FakeIntlProvider>
      <Avatar
        user={{
          id: null,
          name: "somebody",
          imageUrl: null,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.container.querySelector(".root"));

  r.unmount();
});

test("render named user with identicon", () => {
  const r = render(
    <FakeIntlProvider>
      <Avatar
        user={{
          id: "id",
          name: "somebody",
          imageUrl: null,
          premium: false,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.container.querySelector(".root"));

  r.unmount();
});

test("render named user with custom image", () => {
  const r = render(
    <FakeIntlProvider>
      <Avatar
        user={{
          id: "id",
          name: "somebody",
          imageUrl: "https://provider.com/image.png",
          premium: false,
        }}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.container.querySelector(".root"));

  r.unmount();
});
