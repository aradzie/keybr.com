import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { Distribution } from "@keybr/math";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { AccuracyHistogram } from "./AccuracyHistogram.tsx";

test("render empty", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracyHistogram
          distribution={new Distribution(makeData())}
          thresholds={[]}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  r.unmount();
});

test("render non-empty", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracyHistogram
          distribution={new Distribution(makeData())}
          thresholds={[{ label: "Speed", value: 5 }]}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  r.unmount();
});

function makeData() {
  const data = new Array(1001);
  for (let i = 0; i < data.length; i++) {
    data[i] = i;
  }
  return data;
}
