import assert from "node:assert";
import { describe, test } from "node:test";
import { Layout } from "@keybr/keyboard";
import { Result, ResultFaker, TextType } from "@keybr/result";
import { fileChunk, fileHeader, parseFile } from "@keybr/result-io";
import { Histogram } from "@keybr/textinput";
import { deserializeJsonResults, type JsonResult } from "./import-helpers.ts";

describe("deserializeJsonResults", () => {
  const createMockJsonResult = (
    overrides?: Partial<JsonResult>,
  ): JsonResult => ({
    layout: "en-us",
    textType: "generated",
    timeStamp: "2025-01-01T00:00:00.000Z",
    length: 100,
    time: 10000,
    errors: 5,
    speed: 600,
    histogram: [{ codePoint: 97, hitCount: 10, missCount: 2, timeToType: 100 }],
    ...overrides,
  });

  test("should parse valid JSON results", () => {
    const jsonData = [createMockJsonResult()];
    const results = deserializeJsonResults(jsonData);

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].layout.id, "en-us");
    assert.strictEqual(results[0].textType.id, "generated");
  });

  test("should parse multiple results", () => {
    const jsonData = [
      createMockJsonResult({ layout: "en-us" }),
      createMockJsonResult({ layout: "de-de" }),
    ];
    const results = deserializeJsonResults(jsonData);

    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].layout.id, "en-us");
    assert.strictEqual(results[1].layout.id, "de-de");
  });

  test("should throw on unknown layout in strict mode", () => {
    const jsonData = [createMockJsonResult({ layout: "unknown-layout" })];

    assert.throws(() => deserializeJsonResults(jsonData, { strict: true }), {
      message: "Unknown layout: unknown-layout",
    });
  });

  test("should throw on unknown textType in strict mode", () => {
    const jsonData = [createMockJsonResult({ textType: "unknown-type" })];

    assert.throws(() => deserializeJsonResults(jsonData, { strict: true }), {
      message: "Unknown textType: unknown-type",
    });
  });

  test("should throw on invalid date format in strict mode", () => {
    const jsonData = [createMockJsonResult({ timeStamp: "invalid-date" })];

    assert.throws(() => deserializeJsonResults(jsonData, { strict: true }));
  });

  test("should parse histogram data", () => {
    const jsonData = [
      createMockJsonResult({
        histogram: [
          { codePoint: 97, hitCount: 10, missCount: 2, timeToType: 100 },
          { codePoint: 98, hitCount: 5, missCount: 1, timeToType: 150 },
        ],
      }),
    ];

    const results = deserializeJsonResults(jsonData);

    assert.strictEqual(results.length, 1);
    const histogram = results[0].histogram;
    assert.strictEqual(histogram.complexity, 2);
  });

  test("should handle empty histogram", () => {
    const jsonData = [createMockJsonResult({ histogram: [] })];
    const results = deserializeJsonResults(jsonData);

    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].histogram.complexity, 0);
  });

  test("should parse different text types", () => {
    const jsonData = [
      createMockJsonResult({ textType: "generated" }),
      createMockJsonResult({ textType: "natural" }),
      createMockJsonResult({ textType: "code" }),
    ];

    const results = deserializeJsonResults(jsonData);

    assert.strictEqual(results.length, 3);
    assert.strictEqual(results[0].textType.id, "generated");
    assert.strictEqual(results[1].textType.id, "natural");
    assert.strictEqual(results[2].textType.id, "code");
  });

  test("should skip invalid results by default", () => {
    const jsonData = [
      createMockJsonResult(),
      createMockJsonResult({ layout: "invalid-layout" }),
      createMockJsonResult(),
    ];

    let skippedCount = 0;
    const results = deserializeJsonResults(jsonData, {
      onSkipped: () => {
        skippedCount++;
      },
    });

    assert.strictEqual(results.length, 2);
    assert.strictEqual(skippedCount, 1);
  });

  test("should throw on invalid results in strict mode", () => {
    const jsonData = [
      createMockJsonResult(),
      createMockJsonResult({ layout: "invalid-layout" }),
      createMockJsonResult(),
    ];

    assert.throws(() => deserializeJsonResults(jsonData, { strict: true }));
  });
});

describe("parseFile (.stats binary format)", () => {
  test("should parse .stats binary format", async () => {
    const faker = new ResultFaker();
    const result = faker.nextResult();

    const buffer = Buffer.concat([fileHeader(), fileChunk([result])]);

    const parsed = [...(await parseFile(new Uint8Array(buffer)))];

    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].layout.id, result.layout.id);
    assert.strictEqual(parsed[0].textType.id, result.textType.id);
  });

  test("should parse multiple results from .stats file", async () => {
    const faker = new ResultFaker();
    const results = [
      faker.nextResult(),
      faker.nextResult(),
      faker.nextResult(),
    ];

    const buffer = Buffer.concat([fileHeader(), fileChunk(results)]);

    const parsed = [...(await parseFile(new Uint8Array(buffer)))];

    assert.strictEqual(parsed.length, 3);
  });

  test("should handle empty .stats file", async () => {
    const buffer = new Uint8Array(0);

    const parsed = [...(await parseFile(buffer))];

    assert.strictEqual(parsed.length, 0);
  });
});
