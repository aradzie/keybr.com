import { textDisplaySettings, toChars } from "@keybr/textinput";
import test from "ava";
import { IntlProvider } from "react-intl";
import TestRenderer from "react-test-renderer";
import { TextArea } from "./TextArea.tsx";

test("empty", (t) => {
  const testRenderer = TestRenderer.create(
    <IntlProvider locale="en">
      <TextArea settings={textDisplaySettings} lines={[]} />
    </IntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render items", (t) => {
  const testRenderer = TestRenderer.create(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={[
          {
            chars: toChars("abc"),
            key: 1,
          },
          {
            chars: toChars("xyz"),
            key: 2,
          },
        ]}
      />
    </IntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
