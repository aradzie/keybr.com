import { FakeIntlProvider } from "@keybr/intl";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { newDistribution } from "./dist.ts";
import { DistributionChart } from "./DistributionChart.tsx";

test("render empty", (t) => {
  const letters = FakePhoneticModel.letters;
  const faker = new ResultFaker({ letters });
  const results = faker.nextResultList(0);
  const distribution = newDistribution([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <DistributionChart
          results={results}
          distribution={distribution}
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
  const letters = FakePhoneticModel.letters;
  const faker = new ResultFaker({ letters });
  const results = faker.nextResultList(100);
  const distribution = newDistribution([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <DistributionChart
          results={results}
          distribution={distribution}
          width="100px"
          height="100px"
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );
  t.pass();
  r.unmount();
});
