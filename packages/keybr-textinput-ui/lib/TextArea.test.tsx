import { test } from "node:test";
import { textDisplaySettings, toLine } from "@keybr/textinput";
import { act, render } from "@testing-library/react";
import { assert } from "chai";
import { IntlProvider } from "react-intl";
import { TextArea } from "./TextArea.tsx";

test("render empty text", async () => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "", lines: [] }}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  assert.strictEqual(r.container.textContent, "");

  r.unmount();
});

test("render simple text", async () => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abcxyz", lines: [toLine("abc"), toLine("xyz")] }}
      />
    </IntlProvider>,
  );

  await act(async () => {});

  assert.strictEqual(r.container.textContent, "abcxyz");

  r.unmount();
});

test("render styled text", async () => {
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

  assert.strictEqual(r.container.textContent, "abcxyz");

  r.unmount();
});

test("render text with line template", async () => {
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

  assert.strictEqual(r.container.textContent, "[abc][xyz]");

  r.unmount();
});
