import { FakeIntlProvider } from "@keybr/intl";
import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { EmailLoginForm } from "./EmailLoginForm.tsx";
import { type SignInActions } from "./types.ts";

test.serial("success", async (t) => {
  const r = render(
    <FakeIntlProvider>
      <EmailLoginForm
        actions={
          {
            registerEmail: () => {
              return Promise.resolve({});
            },
          } as SignInActions
        }
      />
    </FakeIntlProvider>,
  );

  fireEvent.change(r.getByRole("textbox"), {
    target: { value: "username@email.com" },
  });
  fireEvent.click(r.getByRole("button"));

  await r.findByText("We have sent an e-mail", { exact: false });

  t.not(r.queryByText("username@email.com", { exact: false }), null);

  r.unmount();
});

test.serial("failure", async (t) => {
  const r = render(
    <FakeIntlProvider>
      <EmailLoginForm
        actions={
          {
            registerEmail: () => {
              return Promise.reject(new Error("What a terrible failure"));
            },
          } as SignInActions
        }
      />
    </FakeIntlProvider>,
  );

  fireEvent.change(r.getByRole("textbox"), {
    target: { value: "username@email.com" },
  });
  fireEvent.click(r.getByRole("button"));

  await r.findByText("Could not send e-mail", { exact: false });

  t.not(r.queryByText("What a terrible failure", { exact: false }), null);

  r.unmount();
});
