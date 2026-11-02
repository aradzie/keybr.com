import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { parseAttempt, type RecordingRecord, recordSchema } from "./index.ts";

const fixtures = JSON.parse(
  await readFile(new URL("../fixtures/v1.json", import.meta.url), "utf8"),
);

test("version 1 fixtures can be validated without the browser or typing engine", () => {
  for (const fixture of fixtures.scenarios) {
    const records: RecordingRecord[] = fixture.expected.records;
    records.forEach((record) => recordSchema.parse(record));
    for (const attempt of Object.values(
      Object.groupBy(records, (r) => r.attemptId),
    ))
      parseAttempt(attempt);
  }
});

test("reject unsupported schemas, invalid identities, causal links, and splices", () => {
  const records: RecordingRecord[] = fixtures.scenarios[0].expected.records;
  assert.throws(() => recordSchema.parse({ ...records[0], schemaVersion: 2 }));
  assert.throws(() =>
    recordSchema.parse({ ...records[0], attemptId: "not-a-uuid" }),
  );
  assert.throws(() =>
    recordSchema.parse({ ...records[0], observedAt: Infinity }),
  );
  assert.throws(() => parseAttempt(records.slice(0, -1)));
  assert.throws(() =>
    parseAttempt([
      ...records,
      { ...records.at(-1)!, sequence: records.length },
    ]),
  );
  const corrupted = structuredClone(records);
  const processed = corrupted.find((r) => r.type === "processed")!;
  assert.ok(processed.type === "processed");
  processed.originalSequence = processed.sequence;
  assert.throws(() => parseAttempt(corrupted));
  const badState = structuredClone(records);
  const state = badState.find((r) => r.type === "state")!;
  assert.ok(state.type === "state");
  state.accepted.inserted = [];
  assert.throws(() => parseAttempt(badState));
});
