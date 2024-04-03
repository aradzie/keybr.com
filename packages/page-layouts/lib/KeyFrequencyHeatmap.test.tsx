import { FakeIntlProvider } from "@keybr/intl";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <KeyFrequencyHeatmap keyboard={keyboard} model={model} />
    </FakeIntlProvider>,
  );

  t.snapshot(renderer.toJSON());
});
