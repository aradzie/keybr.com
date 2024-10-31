import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { fireEvent, render } from "@testing-library/react";
import { assert } from "chai";
import { WordCountPage } from "./WordCountPage.tsx";

test("render", async () => {
  const r = render(
    <FakeIntlProvider>
      <WordCountPage />
    </FakeIntlProvider>,
  );

  assert.isNotNull(r.queryByRole("list"));

  fireEvent.focus(r.getByRole("textbox"));

  assert.isNull(r.queryByRole("list"));

  fireEvent.change(r.getByRole("textbox"), {
    target: { value: "text e\u0301xample\u0300" },
  });

  await r.findAllByRole("listitem");

  assert.strictEqual(r.getAllByRole("listitem")[0].textContent, "éxamplè: 1");
  assert.strictEqual(r.getAllByRole("listitem")[1].textContent, "text: 1");

  r.unmount();
});
