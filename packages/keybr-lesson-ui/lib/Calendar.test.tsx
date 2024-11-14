import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { LocalDate, ResultFaker, ResultSummary } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { Calendar } from "./Calendar.tsx";

test("no results", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const summary = new ResultSummary([], today);

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  r.unmount();
});

test("no results today", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const summary = new ResultSummary([r1], today);

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  r.unmount();
});

test("render", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const r2 = faker.nextResult({ timeStamp: today.timeStamp });
  const summary = new ResultSummary([r1, r2], today);

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar summary={summary} />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  r.unmount();
});
