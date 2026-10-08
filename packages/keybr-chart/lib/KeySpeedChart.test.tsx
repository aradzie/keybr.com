import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { Letter } from "@keybr/phonetic-model";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { KeySpeedChart } from "./KeySpeedChart.tsx";

const letter = new Letter(/* "a" */ 0x0061, 1);

test("render empty", () => {
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <KeySpeedChart
          letter={letter}
          samples={[]}
          smoothness={1}
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
        <KeySpeedChart
          letter={letter}
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
  r.unmount();
});
