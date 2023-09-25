import { FakeIntlProvider } from "@keybr/intl";
import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { newKeyStatsMap, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

test("render empty", (t) => {
  const letters = FakePhoneticModel.letters;
  const faker = new ResultFaker({ letters });
  const results = faker.nextResultList(0);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyFrequencyHeatmap
          keyStatsMap={newKeyStatsMap(letters, results)}
          keyboard={loadKeyboard(Layout.getDefault(), { full: false })}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  t.pass();
  r.unmount();
});

test("render non-empty", (t) => {
  const letters = FakePhoneticModel.letters;
  const faker = new ResultFaker({ letters });
  const results = faker.nextResultList(100);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeyFrequencyHeatmap
          keyStatsMap={newKeyStatsMap(letters, results)}
          keyboard={loadKeyboard(Layout.getDefault(), { full: false })}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  t.pass();
  r.unmount();
});
