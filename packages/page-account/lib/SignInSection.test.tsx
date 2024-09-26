import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { type SignInActions } from "./actions.ts";
import { SignInSection } from "./SignInSection.tsx";

test.serial("render", (t) => {
  const r = render(
    <FakeIntlProvider>
      <SignInSection actions={{} as SignInActions} />
    </FakeIntlProvider>,
  );

  t.not(
    r.queryByText("Simple sign-in that does not use passwords.", {
      exact: false,
    }),
    null,
  );
  t.not(
    r.queryByText("Sign-in with your preferred social network.", {
      exact: false,
    }),
    null,
  );
  t.not(r.queryByText("Google", { exact: false }), null);
  t.not(r.queryByText("Microsoft", { exact: false }), null);
  t.not(r.queryByText("Facebook", { exact: false }), null);

  r.unmount();
});
