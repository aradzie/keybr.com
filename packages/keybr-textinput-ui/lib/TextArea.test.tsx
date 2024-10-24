import { textDisplaySettings, toLine } from "@keybr/textinput";
import { act, render } from "@testing-library/react";
import test from "ava";
import { IntlProvider } from "react-intl";
import { TextArea } from "./TextArea.tsx";

test.serial("render empty text", async (t) => {
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

test.serial("render simple text", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abcxyz", lines: [toLine("abc"), toLine("xyz")] }}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  t.is(r.container.textContent, "abcxyz");

  r.unmount();
});

test.serial("render styled text", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{
          text: "abcxyz",
          lines: [
            toLine({ text: "abc", cls: "keyword" }),
            toLine({ text: "xyz", cls: "comment" }),
          ],
        }}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  t.is(r.container.textContent, "abcxyz");

  r.unmount();
});

test.serial("render text with line template", async (t) => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abcxyz", lines: [toLine("abc"), toLine("xyz")] }}
        lineTemplate={({ children }) => <div>[{children}]</div>}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  t.is(r.container.textContent, "[abc][xyz]");

  r.unmount();
});
