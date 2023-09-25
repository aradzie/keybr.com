import { FakeIntlProvider } from "@keybr/intl";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { KeySpeedChart } from "./KeySpeedChart.tsx";

test("render empty", (t) => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySpeedChart
          samples={[]}
          smoothness={1}
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
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySpeedChart
          samples={[
            {
              index: 1,
              timeStamp: 1000,
              hitCount: 10,
              missCount: 0,
              timeToType: 300,
              filteredTimeToType: 300,
            },
            {
              index: 3,
              timeStamp: 2000,
              hitCount: 10,
              missCount: 0,
              timeToType: 300,
              filteredTimeToType: 300,
            },
            {
              index: 5,
              timeStamp: 3000,
              hitCount: 10,
              missCount: 0,
              timeToType: 300,
              filteredTimeToType: 300,
            },
          ]}
          smoothness={1}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  t.pass();
  r.unmount();
});
