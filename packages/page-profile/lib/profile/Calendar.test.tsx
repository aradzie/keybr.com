import { FakeIntlProvider } from "@keybr/intl";
import { LocalDate, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import test from "ava";
import { Calendar } from "./Calendar.tsx";
import { ResultSummary } from "./resultsummary.ts";

test.serial("no results", (t) => {
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

  t.pass();

  r.unmount();
});

test.serial("no results today", (t) => {
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

  t.pass();

  r.unmount();
});

test.serial("render", (t) => {
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

  t.pass();

  r.unmount();
});
