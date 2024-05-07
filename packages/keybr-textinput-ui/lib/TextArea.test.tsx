import { textDisplaySettings, toLine } from "@keybr/textinput";
import { act, render } from "@testing-library/react";
import test from "ava";
import { IntlProvider } from "react-intl";
import { TextArea } from "./TextArea.tsx";

test.serial("empty", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "", lines: [] }}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  t.is(r.container.textContent, "");

  r.unmount();
});

test.serial("render items", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abc xyz", lines: [toLine("abc"), toLine("xyz")] }}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  t.is(r.container.textContent, "abcxyz");

  r.unmount();
});
