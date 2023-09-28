import { FakeIntlProvider } from "@keybr/intl";
import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.getDefault(), { full: false });

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <KeyboardContext.Provider value={keyboard}>
        <KeyFrequencyHeatmap keyboard={keyboard} />
      </KeyboardContext.Provider>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
