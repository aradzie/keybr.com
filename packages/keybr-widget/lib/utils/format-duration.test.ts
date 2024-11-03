import { test } from "node:test";
import { assert } from "chai";
import { formatDuration } from "./format-duration.ts";

test("format duration in seconds", () => {
  assert.strictEqual(formatDuration(0), "00:00:00");
  assert.strictEqual(formatDuration(1), "00:00:00");
  assert.strictEqual(formatDuration(1_000), "00:00:01");
  assert.strictEqual(formatDuration(60_000), "00:01:00");
  assert.strictEqual(formatDuration(61_000), "00:01:01");
  assert.strictEqual(formatDuration(3_600_000), "01:00:00");
  assert.strictEqual(formatDuration(3_601_000), "01:00:01");
  assert.strictEqual(formatDuration(3_661_000), "01:01:01");
});

test("format duration in milliseconds", () => {
  assert.strictEqual(formatDuration(0, { showMillis: true }), "00:00:00.00");
  assert.strictEqual(formatDuration(1, { showMillis: true }), "00:00:00.00");
  assert.strictEqual(formatDuration(9, { showMillis: true }), "00:00:00.00");
  assert.strictEqual(formatDuration(10, { showMillis: true }), "00:00:00.01");
  assert.strictEqual(formatDuration(11, { showMillis: true }), "00:00:00.01");
  assert.strictEqual(formatDuration(99, { showMillis: true }), "00:00:00.09");
  assert.strictEqual(formatDuration(100, { showMillis: true }), "00:00:00.10");
  assert.strictEqual(formatDuration(101, { showMillis: true }), "00:00:00.10");
  assert.strictEqual(
    formatDuration(1_000, { showMillis: true }),
    "00:00:01.00",
  );
  assert.strictEqual(
    formatDuration(60_000, { showMillis: true }),
    "00:01:00.00",
  );
  assert.strictEqual(
    formatDuration(61_000, { showMillis: true }),
    "00:01:01.00",
  );
  assert.strictEqual(
    formatDuration(61_010, { showMillis: true }),
    "00:01:01.01",
  );
});
