import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import { isNotNull } from "rich-assert";
import { AccountSection } from "./AccountSection.tsx";
import { type AccountActions } from "./actions.ts";

test("render", () => {
  const r = render(
    <FakeIntlProvider>
      <AccountSection
        user={{
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
        }}
        publicUser={{
          id: "xyz",
          name: "unique user name",
          imageUrl: null,
          premium: false,
        }}
        actions={{} as AccountActions}
      />
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByText("unique user name"));

  r.unmount();
});
