import { FakeIntlProvider } from "@keybr/intl";
import { LocalDate, ResultFaker, ResultSummary } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import test from "ava";
import TestRenderer from "react-test-renderer";
import { Calendar } from "./Calendar.tsx";

test("no results", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const summary = new ResultSummary([], today);

  // Act.

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.snapshot(renderer.toJSON());
});

test("no results today", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const summary = new ResultSummary([r1], today);

  // Act.

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.snapshot(renderer.toJSON());
});

test("render", (t) => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const r2 = faker.nextResult({ timeStamp: today.timeStamp });
  const summary = new ResultSummary([r1, r2], today);

  // Act.

  const renderer = TestRenderer.create(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  t.snapshot(renderer.toJSON());
});
