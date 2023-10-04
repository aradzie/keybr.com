import {
  attrCursor,
  attrHit,
  attrMiss,
  attrNormal,
  textDisplaySettings,
} from "@keybr/textinput";
import test from "ava";
import { IntlProvider } from "react-intl";
import TestRenderer from "react-test-renderer";
import { TextArea } from "./TextArea.tsx";

test("empty", (t) => {
  const testRenderer = TestRenderer.create(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={[]}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    </IntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render items", (t) => {
  const text = "text";

  const testRenderer = TestRenderer.create(
    <IntlProvider locale="en">
      <TextArea
        settings={textDisplaySettings}
        lines={[
          {
            chars: [
              { codePoint: text.codePointAt(0)!, attrs: attrMiss },
              { codePoint: text.codePointAt(1)!, attrs: attrHit },
              { codePoint: text.codePointAt(2)!, attrs: attrCursor },
              { codePoint: text.codePointAt(3)!, attrs: attrNormal },
            ],
            key: 1,
          },
        ]}
        onFocus={() => {}}
        onBlur={() => {}}
      />
    </IntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
