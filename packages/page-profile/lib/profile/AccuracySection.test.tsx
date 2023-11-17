import { FakeIntlProvider } from "@keybr/intl";
import { LocalDate, ResultFaker, ResultSummary } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { AccuracySection } from "./AccuracySection.tsx";

test("no streaks", (t) => {
  // Arrange.

  const summary = new ResultSummary([], new LocalDate(0));

  // Act.

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracySection summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.snapshot(testRenderer.toJSON());
});

test("one streak", (t) => {
  // Arrange.

  const faker = new ResultFaker();
  const r1 = faker.nextResult({ length: 100, errors: 0 });
  const summary = new ResultSummary([r1], new LocalDate(r1.timeStamp));

  // Act.

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracySection summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.snapshot(testRenderer.toJSON());
});
