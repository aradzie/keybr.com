import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { Avatar } from "./Avatar.tsx";

test.serial("render anonymous user without image", (t) => {
  const r = render(
    <FakeIntlProvider>
      <Avatar user={null} />
    </FakeIntlProvider>,
  );

  t.not(r.container.querySelector(".root"), null);

  r.unmount();
});

test.serial("render anonymous user with identicon", (t) => {
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

  t.not(r.container.querySelector(".root"), null);

  r.unmount();
});

test.serial("render named user with identicon", (t) => {
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

  t.not(r.container.querySelector(".root"), null);

  r.unmount();
});

test.serial("render named user with custom image", (t) => {
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

  t.not(r.container.querySelector(".root"), null);

  r.unmount();
});
