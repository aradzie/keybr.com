import { test } from "node:test";
import { assert } from "chai";
import { createIntl } from "react-intl";
import { makeIntlDurations } from "./durations.ts";

test("unique instance", () => {
  const intl = createIntl({ locale: "en-US" });
  const a = makeIntlDurations(intl);
  const b = makeIntlDurations(intl);

  assert.strictEqual(a, b);
});

test("format duration en-US", () => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "en-US" }));

  assert.strictEqual(formatDuration({}), "");
  assert.strictEqual(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  assert.strictEqual(formatDuration({ hours: 1 }), "1 hour");
  assert.strictEqual(formatDuration({ hours: 2 }), "2 hours");
  assert.strictEqual(formatDuration({ minutes: 1 }), "1 minute");
  assert.strictEqual(formatDuration({ minutes: 2 }), "2 minutes");
  assert.strictEqual(formatDuration({ seconds: 1 }), "1 second");
  assert.strictEqual(formatDuration({ seconds: 2 }), "2 seconds");
  assert.strictEqual(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "1 hour, 1 minute, and 1 second",
  );
});

test("format duration pl-PL", () => {
  const { formatDuration } = makeIntlDurations(createIntl({ locale: "pl-PL" }));

  assert.strictEqual(formatDuration({}), "");
  assert.strictEqual(formatDuration({ hours: 0, minutes: 0, seconds: 0 }), "");
  assert.strictEqual(formatDuration({ hours: 1 }), "1 godzina");
  assert.strictEqual(formatDuration({ hours: 2 }), "2 godziny");
  assert.strictEqual(formatDuration({ minutes: 1 }), "1 minuta");
  assert.strictEqual(formatDuration({ minutes: 2 }), "2 minuty");
  assert.strictEqual(formatDuration({ seconds: 1 }), "1 sekunda");
  assert.strictEqual(formatDuration({ seconds: 2 }), "2 sekundy");
  assert.strictEqual(
    formatDuration({ hours: 1, minutes: 1, seconds: 1 }),
    "1 godzina, 1 minuta i 1 sekunda",
  );
});

test("humanize duration en-US", () => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "en-US" }),
  );

  assert.strictEqual(humanizeDuration(0), "0 seconds");
  assert.strictEqual(humanizeDuration(1), "1 second");
  assert.strictEqual(humanizeDuration(59), "59 seconds");
  assert.strictEqual(humanizeDuration(60), "1 minute");
  assert.strictEqual(humanizeDuration(3540), "59 minutes");
  assert.strictEqual(humanizeDuration(3600), "1 hour");
  assert.strictEqual(humanizeDuration(356400), "99 hours");
  assert.strictEqual(
    humanizeDuration(359999),
    "99 hours, 59 minutes, and 59 seconds",
  );
});

test("humanize duration pl-PL", () => {
  const { humanizeDuration } = makeIntlDurations(
    createIntl({ locale: "pl-PL" }),
  );

  assert.strictEqual(humanizeDuration(0), "0 sekund");
  assert.strictEqual(humanizeDuration(1), "1 sekunda");
  assert.strictEqual(humanizeDuration(59), "59 sekund");
  assert.strictEqual(humanizeDuration(60), "1 minuta");
  assert.strictEqual(humanizeDuration(3540), "59 minut");
  assert.strictEqual(humanizeDuration(3600), "1 godzina");
  assert.strictEqual(humanizeDuration(356400), "99 godzin");
  assert.strictEqual(
    humanizeDuration(359999),
    "99 godzin, 59 minut i 59 sekund",
  );
});
