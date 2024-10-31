import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { type SignInActions } from "./actions.ts";
import { SignInSection } from "./SignInSection.tsx";

test("render", () => {
  const r = render(
    <FakeIntlProvider>
      <SignInSection actions={{} as SignInActions} />
    </FakeIntlProvider>,
  );

  assert.isNotNull(
    r.queryByText("Simple sign-in that does not use passwords.", {
      exact: false,
    }),
  );
  assert.isNotNull(
    r.queryByText("Sign-in with your preferred social network.", {
      exact: false,
    }),
  );
  assert.isNotNull(r.queryByText("Google", { exact: false }));
  assert.isNotNull(r.queryByText("Microsoft", { exact: false }));
  assert.isNotNull(r.queryByText("Facebook", { exact: false }));

  r.unmount();
});
