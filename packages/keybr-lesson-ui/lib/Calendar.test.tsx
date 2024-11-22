import { test } from "node:test";
import { parseColor } from "@keybr/color";
import { FakeIntlProvider } from "@keybr/intl";
import { DailyStatsMap, LocalDate, ResultFaker } from "@keybr/result";
import { FakeSettingsContext } from "@keybr/settings";
import { render } from "@testing-library/react";
import { equal } from "rich-assert";
import { Calendar } from "./Calendar.tsx";

test("no results", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const dailyStatsMap = new DailyStatsMap([], today);

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar
          dailyStatsMap={dailyStatsMap}
          effort={{
            effort: () => 0,
            shade: () => parseColor("#ffffff"),
          }}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  equal(r.container.querySelectorAll("[data-date]").length, 0);

  r.unmount();
});

test("no results today", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const dailyStatsMap = new DailyStatsMap([r1], today);

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar
          dailyStatsMap={dailyStatsMap}
          effort={{
            effort: () => 0,
            shade: () => parseColor("#ffffff"),
          }}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  equal(r.container.querySelectorAll("[data-date]").length, 1);

  r.unmount();
});

test("render", () => {
  // Arrange.

  const today = new LocalDate(2001, 2, 3);
  const yesterday = today.minusDays(1);
  const faker = new ResultFaker();
  const r1 = faker.nextResult({ timeStamp: yesterday.timeStamp });
  const r2 = faker.nextResult({ timeStamp: today.timeStamp });
  const dailyStatsMap = new DailyStatsMap([r1, r2], today);

  // Act.

  const r = render(
    <FakeIntlProvider>
      <FakeSettingsContext>
        <Calendar
          dailyStatsMap={dailyStatsMap}
          effort={{
            effort: () => 0.5,
            shade: () => parseColor("#ffffff"),
          }}
        />
      </FakeSettingsContext>
    </FakeIntlProvider>,
  );

  // Assert.

  equal(r.container.querySelectorAll("[data-date]").length, 2);

  r.unmount();
});
