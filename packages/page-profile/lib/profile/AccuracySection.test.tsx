import { FakeIntlProvider } from "@keybr/intl";
import { ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { AccuracySection } from "./AccuracySection.tsx";

test("no streaks", (t) => {
  // Act.

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracySection results={[]} />
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

  // Act.

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <AccuracySection results={[r1]} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.snapshot(testRenderer.toJSON());
});
