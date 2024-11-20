import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { act, fireEvent, render } from "@testing-library/react";
import { equal, isNotNull, isNull } from "rich-assert";
import { WordCountPage } from "./WordCountPage.tsx";

test("render", (ctx) => {
  ctx.mock.timers.enable({ apis: ["setTimeout"] });

  const r = render(
    <FakeIntlProvider>
      <WordCountPage />
    </FakeIntlProvider>,
  );

  isNotNull(r.queryByRole("list"));

  act(() => {
    fireEvent.focus(r.getByRole("textbox"));
  });
  act(() => {
    ctx.mock.timers.runAll();
  });

  isNull(r.queryByRole("list"));

  act(() => {
    fireEvent.change(r.getByRole("textbox"), {
      target: { value: "text e\u0301xample\u0300" },
    });
  });
  act(() => {
    ctx.mock.timers.runAll();
  });

  equal(r.getAllByRole("listitem")[0].textContent, "éxamplè: 1");
  equal(r.getAllByRole("listitem")[1].textContent, "text: 1");

  r.unmount();
});
