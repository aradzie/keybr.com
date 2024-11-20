import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { fireEvent, render } from "@testing-library/react";
import { isNotNull } from "rich-assert";
import { type SignInActions } from "./actions.ts";
import { EmailLoginForm } from "./EmailLoginForm.tsx";

test("success", async () => {
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

  isNotNull(r.queryByText("username@email.com", { exact: false }));

  r.unmount();
});

test("failure", async () => {
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

  isNotNull(r.queryByText("What a terrible failure", { exact: false }));

  r.unmount();
});
