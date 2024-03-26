import { textDisplaySettings, toLine } from "@keybr/textinput";
import test from "ava";
import { IntlProvider } from "react-intl";
import TestRenderer from "react-test-renderer";
import { TextArea } from "./TextArea.tsx";

test("empty", (t) => {
  const renderer = TestRenderer.create(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "", lines: [] }}
      />
    </IntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});

test("render items", (t) => {
  const renderer = TestRenderer.create(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={{ text: "abc xyz", lines: [toLine("abc"), toLine("xyz")] }}
      />
    </IntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});
