import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { SpeedChart } from "./SpeedChart.tsx";

test("render empty", () => {
  const letters = FakePhoneticModel.letters;
  const faker = new ResultFaker({ letters });
  const results = faker.nextResultList(0);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <SpeedChart
          results={results}
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
  const letters = FakePhoneticModel.letters;
  const faker = new ResultFaker({ letters });
  const results = faker.nextResultList(100);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <SpeedChart
          results={results}
          smoothness={1}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  r.unmount();
});
