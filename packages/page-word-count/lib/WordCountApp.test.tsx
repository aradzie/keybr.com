import { FakeIntlProvider } from "@keybr/intl";
import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { WordCountApp } from "./WordCountApp.tsx";

test.serial("render", async (t) => {
  const r = render(
    <FakeIntlProvider>
      <WordCountApp />
    </FakeIntlProvider>,
  );

  t.not(r.queryByRole("list"), null);

  fireEvent.focus(r.getByRole("textbox"));

  t.is(r.queryByRole("list"), null);

  fireEvent.change(r.getByRole("textbox"), {
    target: { value: "text e\u0301xample\u0300" },
  });

  await r.findAllByRole("listitem");

  t.is(r.getAllByRole("listitem")[0].textContent, "éxamplè: 1");
  t.is(r.getAllByRole("listitem")[1].textContent, "text: 1");

  r.unmount();
});
