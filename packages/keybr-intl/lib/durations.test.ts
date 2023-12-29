import test from "ava";
import { createIntl } from "react-intl";
import { makeIntlDurations } from "./durations.ts";

test("unique instance", (t) => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDurations(intl);
  const b = makeIntlDurations(intl);

  t.true(a === b);
});

test("format duration en-US", (t) => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "en-US" }));

  t.is(formatDuration({}), "");
  t.is(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  t.is(formatDuration({ hours: 1 }), "1 hour");
  t.is(formatDuration({ hours: 2 }), "2 hours");
  t.is(formatDuration({ minutes: 1 }), "1 minute");
  t.is(formatDuration({ minutes: 2 }), "2 minutes");
  t.is(formatDuration({ seconds: 1 }), "1 second");
  t.is(formatDuration({ seconds: 2 }), "2 seconds");
  t.is(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "1 hour, 1 minute, and 1 second",
  );
});

test("format duration pl-PL", (t) => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "pl-PL" }));

  t.is(formatDuration({}), "");
  t.is(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  t.is(formatDuration({ hours: 1 }), "1 godzina");
  t.is(formatDuration({ hours: 2 }), "2 godziny");
  t.is(formatDuration({ minutes: 1 }), "1 minuta");
  t.is(formatDuration({ minutes: 2 }), "2 minuty");
  t.is(formatDuration({ seconds: 1 }), "1 sekunda");
  t.is(formatDuration({ seconds: 2 }), "2 sekundy");
  t.is(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "1 godzina, 1 minuta i 1 sekunda",
  );
});

test("humanize duration en-US", (t) => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "en-US" }),
  );

  t.is(humanizeDuration(0), "0 seconds");
  t.is(humanizeDuration(1), "1 second");
  t.is(humanizeDuration(59), "59 seconds");
  t.is(humanizeDuration(60), "1 minute");
  t.is(humanizeDuration(3540), "59 minutes");
  t.is(humanizeDuration(3600), "1 hour");
  t.is(humanizeDuration(356400), "99 hours");
  t.is(humanizeDuration(359999), "99 hours, 59 minutes, and 59 seconds");
});

test("humanize duration pl-PL", (t) => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "pl-PL" }),
  );

  t.is(humanizeDuration(0), "0 sekund");
  t.is(humanizeDuration(1), "1 sekunda");
  t.is(humanizeDuration(59), "59 sekund");
  t.is(humanizeDuration(60), "1 minuta");
  t.is(humanizeDuration(3540), "59 minut");
  t.is(humanizeDuration(3600), "1 godzina");
  t.is(humanizeDuration(356400), "99 godzin");
  t.is(humanizeDuration(359999), "99 godzin, 59 minut i 59 sekund");
});
