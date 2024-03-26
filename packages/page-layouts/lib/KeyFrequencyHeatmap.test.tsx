import { FakeIntlProvider } from "@keybr/intl";
import { KeyboardContext, Layout, loadKeyboard } from "@keybr/keyboard";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <KeyboardContext.Provider value={keyboard}>
        <KeyFrequencyHeatmap keyboard={keyboard} />
      </KeyboardContext.Provider>
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});
