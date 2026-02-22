import assert from "node:assert";
import { describe, test } from "node:test";
import { Layout } from "@keybr/keyboard";
import { Result, TextType } from "@keybr/result";
import { Histogram } from "@keybr/textinput";
import {
  deserializeJsonResults,
  detectDuplicates,
  type JsonResult,
} from "./import.ts";

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

  test("should throw on unknown layout", () => {
    const jsonData = [createMockJsonResult({ layout: "unknown-layout" })];

    assert.throws(() => deserializeJsonResults(jsonData), {
      message: "Unknown layout: unknown-layout",
    });
  });

  test("should throw on unknown textType", () => {
    const jsonData = [createMockJsonResult({ textType: "unknown-type" })];

    assert.throws(() => deserializeJsonResults(jsonData), {
      message: "Unknown textType: unknown-type",
    });
  });

  test("should throw on invalid date format", () => {
    const jsonData = [createMockJsonResult({ timeStamp: "invalid-date" })];

    assert.throws(() => deserializeJsonResults(jsonData));
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
});

describe("detectDuplicates", () => {
  const createResult = (
    timeStamp: number,
    layoutId: string = "en-us",
  ): Result => {
    const layout = Layout.ALL.find(({ id }) => id === layoutId)!;
    const textType = TextType.ALL.find(({ id }) => id === "generated")!;
    return new Result(
      layout,
      textType,
      timeStamp,
      100,
      10000,
      5,
      Histogram.empty,
    );
  };

  test("should detect duplicates by timestamp", () => {
    const existing = [
      createResult(1000),
      createResult(2000),
      createResult(3000),
    ];
    const imported = [createResult(2000), createResult(4000)];

    const [newResults, duplicateCount] = detectDuplicates(existing, imported);

    assert.strictEqual(newResults.length, 1);
    assert.strictEqual(newResults[0].timeStamp, 4000);
    assert.strictEqual(duplicateCount, 1);
  });

  test("should handle all duplicates", () => {
    const existing = [createResult(1000), createResult(2000)];
    const imported = [createResult(1000), createResult(2000)];

    const [newResults, duplicateCount] = detectDuplicates(existing, imported);

    assert.strictEqual(newResults.length, 0);
    assert.strictEqual(duplicateCount, 2);
  });

  test("should handle all new results", () => {
    const existing = [createResult(1000)];
    const imported = [createResult(2000), createResult(3000)];

    const [newResults, duplicateCount] = detectDuplicates(existing, imported);

    assert.strictEqual(newResults.length, 2);
    assert.strictEqual(duplicateCount, 0);
  });

  test("should handle empty existing results", () => {
    const existing: Result[] = [];
    const imported = [createResult(1000), createResult(2000)];

    const [newResults, duplicateCount] = detectDuplicates(existing, imported);

    assert.strictEqual(newResults.length, 2);
    assert.strictEqual(duplicateCount, 0);
  });

  test("should handle empty import", () => {
    const existing = [createResult(1000)];
    const imported: Result[] = [];

    const [newResults, duplicateCount] = detectDuplicates(existing, imported);

    assert.strictEqual(newResults.length, 0);
    assert.strictEqual(duplicateCount, 0);
  });

  test("should handle mixed duplicates and non-duplicates", () => {
    const existing = [
      createResult(1000),
      createResult(2000),
      createResult(3000),
    ];
    const imported = [
      createResult(1000), // duplicate
      createResult(2000), // duplicate
      createResult(4000), // new
      createResult(5000), // new
    ];

    const [newResults, duplicateCount] = detectDuplicates(existing, imported);

    assert.strictEqual(newResults.length, 2);
    assert.strictEqual(duplicateCount, 2);
    assert.strictEqual(newResults[0].timeStamp, 4000);
    assert.strictEqual(newResults[1].timeStamp, 5000);
  });
});
