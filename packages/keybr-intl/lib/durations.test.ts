import test from "ava";
import { createIntl } from "react-intl";
import { makeIntlDurations } from "./durations.ts";

test("unique instance", (t) => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDurations(intl);
  const b = makeIntlDurations(intl);

  t.true(a === b);
});

test("format duration", (t) => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "en-US" }));

  t.is(formatDuration({}), "");
  t.is(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  t.is(formatDuration({ hours: 1 }), "one hour");
  t.is(formatDuration({ hours: 2 }), "2 hours");
  t.is(formatDuration({ minutes: 1 }), "one minute");
  t.is(formatDuration({ minutes: 2 }), "2 minutes");
  t.is(formatDuration({ seconds: 1 }), "one second");
  t.is(formatDuration({ seconds: 2 }), "2 seconds");
  t.is(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "one hour one minute and one second",
  );
});

test("humanize duration", (t) => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "en-US" }),
  );

  t.is(humanizeDuration(0), "zero seconds");
  t.is(humanizeDuration(1), "one second");
  t.is(humanizeDuration(59), "59 seconds");
  t.is(humanizeDuration(60), "one minute");
  t.is(humanizeDuration(3540), "59 minutes");
  t.is(humanizeDuration(3600), "one hour");
  t.is(humanizeDuration(356400), "99 hours");
  t.is(humanizeDuration(359999), "99 hours 59 minutes and 59 seconds");
});
