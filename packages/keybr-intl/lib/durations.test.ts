import { test } from "node:test";
import { createIntl } from "react-intl";
import { equal } from "rich-assert";
import { makeIntlDurations } from "./durations.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDurations(intl);
  const b = makeIntlDurations(intl);

  equal(a, b);
});

test("format duration en-US", () => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "en-US" }));

  equal(formatDuration({}), "");
  equal(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  equal(formatDuration({ hours: 1 }), "1 hour");
  equal(formatDuration({ hours: 2 }), "2 hours");
  equal(formatDuration({ minutes: 1 }), "1 minute");
  equal(formatDuration({ minutes: 2 }), "2 minutes");
  equal(formatDuration({ seconds: 1 }), "1 second");
  equal(formatDuration({ seconds: 2 }), "2 seconds");
  equal(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "1 hour, 1 minute, and 1 second",
  );
});

test("format duration pl-PL", () => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "pl-PL" }));

  equal(formatDuration({}), "");
  equal(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  equal(formatDuration({ hours: 1 }), "1 godzina");
  equal(formatDuration({ hours: 2 }), "2 godziny");
  equal(formatDuration({ minutes: 1 }), "1 minuta");
  equal(formatDuration({ minutes: 2 }), "2 minuty");
  equal(formatDuration({ seconds: 1 }), "1 sekunda");
  equal(formatDuration({ seconds: 2 }), "2 sekundy");
  equal(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "1 godzina, 1 minuta i 1 sekunda",
  );
});

test("humanize duration en-US", () => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "en-US" }),
  );

  equal(humanizeDuration(0), "0 seconds");
  equal(humanizeDuration(1), "1 second");
  equal(humanizeDuration(59), "59 seconds");
  equal(humanizeDuration(60), "1 minute");
  equal(humanizeDuration(3540), "59 minutes");
  equal(humanizeDuration(3600), "1 hour");
  equal(humanizeDuration(356400), "99 hours");
  equal(humanizeDuration(359999), "99 hours, 59 minutes, and 59 seconds");
});

test("humanize duration pl-PL", () => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "pl-PL" }),
  );

  equal(humanizeDuration(0), "0 sekund");
  equal(humanizeDuration(1), "1 sekunda");
  equal(humanizeDuration(59), "59 sekund");
  equal(humanizeDuration(60), "1 minuta");
  equal(humanizeDuration(3540), "59 minut");
  equal(humanizeDuration(3600), "1 godzina");
  equal(humanizeDuration(356400), "99 godzin");
  equal(humanizeDuration(359999), "99 godzin, 59 minut i 59 sekund");
});
