import { test } from "node:test";
import { equal } from "rich-assert";
import { formatDuration } from "./format-duration.ts";

test("format duration in seconds", () => {
  equal(formatDuration(0), "00:00:00");
  equal(formatDuration(1), "00:00:00");
  equal(formatDuration(1_000), "00:00:01");
  equal(formatDuration(60_000), "00:01:00");
  equal(formatDuration(61_000), "00:01:01");
  equal(formatDuration(3_600_000), "01:00:00");
  equal(formatDuration(3_601_000), "01:00:01");
  equal(formatDuration(3_661_000), "01:01:01");
});

test("format duration in milliseconds", () => {
  equal(formatDuration(0, { showMillis: true }), "00:00:00.00");
  equal(formatDuration(1, { showMillis: true }), "00:00:00.00");
  equal(formatDuration(9, { showMillis: true }), "00:00:00.00");
  equal(formatDuration(10, { showMillis: true }), "00:00:00.01");
  equal(formatDuration(11, { showMillis: true }), "00:00:00.01");
  equal(formatDuration(99, { showMillis: true }), "00:00:00.09");
  equal(formatDuration(100, { showMillis: true }), "00:00:00.10");
  equal(formatDuration(101, { showMillis: true }), "00:00:00.10");
  equal(formatDuration(1_000, { showMillis: true }), "00:00:01.00");
  equal(formatDuration(60_000, { showMillis: true }), "00:01:00.00");
  equal(formatDuration(61_000, { showMillis: true }), "00:01:01.00");
  equal(formatDuration(61_010, { showMillis: true }), "00:01:01.01");
});
