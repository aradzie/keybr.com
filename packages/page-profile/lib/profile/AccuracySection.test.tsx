import { FakeIntlProvider } from "@keybr/intl";
import { LocalDate, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { AccuracySection } from "./AccuracySection.tsx";
import { ResultSummary } from "./resultsummary.ts";

test.serial("no streaks", (t) => {
  // Arrange.

  const summary = new ResultSummary([], new LocalDate(0));

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracySection summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.is(r.queryByText("Accuracy Threshold", { exact: false }), null);

  r.unmount();
});

test.serial("one streak", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 0 });
  const summary = new ResultSummary([r1], new LocalDate(r1.timeStamp));

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracySection summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.not(r.queryByText("Accuracy Threshold", { exact: false }), null);

  r.unmount();
});
