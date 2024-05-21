import { FakeIntlProvider } from "@keybr/intl";
import { Distribution } from "@keybr/math";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { DistributionChart } from "./DistributionChart.tsx";

test("render empty", (t) => {
  const distribution = new Distribution([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <DistributionChart
          distribution={distribution}
          thresholds={[]}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  t.pass();
  r.unmount();
});

test("render non-empty", (t) => {
  const distribution = new Distribution([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <DistributionChart
          distribution={distribution}
          thresholds={[{ label: "Speed", value: 5 }]}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  t.pass();
  r.unmount();
});
