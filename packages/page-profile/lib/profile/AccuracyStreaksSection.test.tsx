import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { LocalDate, ResultFaker, ResultSummary } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { isNotNull, isNull } from "rich-assert";
import { AccuracyStreaksSection } from "./AccuracyStreaksSection.tsx";

test("no streaks", () => {
  // Arrange.

  const summary = new ResultSummary([], new LocalDate(0));

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracyStreaksSection summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  isNull(r.queryByText("Accuracy Threshold", { exact: false }));

  r.unmount();
});

test("one streak", () => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 0 });
  const summary = new ResultSummary([r1], new LocalDate(r1.timeStamp));

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracyStreaksSection summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  isNotNull(r.queryByText("Accuracy Threshold", { exact: false }));

  r.unmount();
});
