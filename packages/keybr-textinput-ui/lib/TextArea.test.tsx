import { test } from "node:test";
import { textDisplaySettings, toLine } from "@keybr/textinput";
import { render } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { equal } from "rich-assert";
import { TextArea } from "./TextArea.tsx";

test("render empty text", () => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "", lines: [] }}
      />
    </IntlProvider>,
  );

  equal(r.container.textContent, "");

  r.unmount();
});

test("render simple text", () => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abcxyz", lines: [toLine("abc"), toLine("xyz")] }}
      />
    </IntlProvider>,
  );

  equal(r.container.textContent, "abcxyz");

  r.unmount();
});

test("render styled text", () => {
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

  equal(r.container.textContent, "abcxyz");

  r.unmount();
});

test("render text with line template", () => {
  const r = render(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abcxyz", lines: [toLine("abc"), toLine("xyz")] }}
        lineTemplate={({ children }) => <div>[{children}]</div>}
      />
    </IntlProvider>,
  );

  equal(r.container.textContent, "[abc][xyz]");

  r.unmount();
});
