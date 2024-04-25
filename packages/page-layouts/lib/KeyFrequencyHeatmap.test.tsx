import { FakeIntlProvider } from "@keybr/intl";
import { Layout, loadKeyboard } from "@keybr/keyboard";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { render } from "@testing-library/react";
import test from "ava";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

test("render", (t) => {
  const keyboard = loadKeyboard(Layout.EN_US);
  const model = new FakePhoneticModel();

  const r = render(
    <FakeIntlProvider>
      <KeyFrequencyHeatmap keyboard={keyboard} model={model} />
    </FakeIntlProvider>,
  );

  t.pass();

  r.unmount();
});
