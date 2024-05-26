import { render } from "@testing-library/react";
import test from "ava";
import { IntlProvider } from "react-intl";
import { Dir } from "./Dir.tsx";

test.serial("left-to-right", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <Dir swap="title">
        <div title="left">a</div>
        <div title="right">b</div>
      </Dir>
    </IntlProvider>,
  );

  t.is((await r.getByTitle("left")).textContent, "a");
  t.is((await r.getByTitle("right")).textContent, "b");

  r.unmount();
});

test.serial("right-to-left", async (t) => {
  const r = render(
    <IntlProvider locale="he">
      <Dir swap="title">
        <div title="left">a</div>
        <div title="right">b</div>
      </Dir>
    </IntlProvider>,
  );

  t.is((await r.getByTitle("left")).textContent, "b");
  t.is((await r.getByTitle("right")).textContent, "a");

  r.unmount();
});
