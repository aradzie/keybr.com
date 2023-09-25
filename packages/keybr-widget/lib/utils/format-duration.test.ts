import test from "ava";
import { formatDuration } from "./format-duration.ts";

test("format duration in seconds", (t) => {
  t.is(formatDuration(0), "00:00:00");
  t.is(formatDuration(1), "00:00:00");
  t.is(formatDuration(1_000), "00:00:01");
  t.is(formatDuration(60_000), "00:01:00");
  t.is(formatDuration(61_000), "00:01:01");
  t.is(formatDuration(3_600_000), "01:00:00");
  t.is(formatDuration(3_601_000), "01:00:01");
  t.is(formatDuration(3_661_000), "01:01:01");
});

test("format duration in milliseconds", (t) => {
  t.is(formatDuration(0, { showMillis: true }), "00:00:00.00");
  t.is(formatDuration(1, { showMillis: true }), "00:00:00.00");
  t.is(formatDuration(9, { showMillis: true }), "00:00:00.00");
  t.is(formatDuration(10, { showMillis: true }), "00:00:00.01");
  t.is(formatDuration(11, { showMillis: true }), "00:00:00.01");
  t.is(formatDuration(99, { showMillis: true }), "00:00:00.09");
  t.is(formatDuration(100, { showMillis: true }), "00:00:00.10");
  t.is(formatDuration(101, { showMillis: true }), "00:00:00.10");
  t.is(formatDuration(1_000, { showMillis: true }), "00:00:01.00");
  t.is(formatDuration(60_000, { showMillis: true }), "00:01:00.00");
  t.is(formatDuration(61_000, { showMillis: true }), "00:01:01.00");
  t.is(formatDuration(61_010, { showMillis: true }), "00:01:01.01");
});
