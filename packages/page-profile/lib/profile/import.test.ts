import assert from "node:assert";
import { describe, test } from "node:test";
import { Layout } from "@keybr/keyboard";
import { Result, TextType } from "@keybr/result";
import { Histogram } from "@keybr/textinput";

type JsonResult = {
  layout: string;
  textType: string;
  timeStamp: string; // ISO date string
  length: number;
  time: number;
  errors: number;
  speed: number;
  histogram: Array<{
    codePoint: number;
    hitCount: number;
    missCount: number;
    timeToType: number;
  }>;
};

function deserializeJsonResults(jsonData: JsonResult[]): Result[] {
  const results: Result[] = [];

  for (const data of jsonData) {
    const layout = Layout.ALL.find(({ id }) => id === data.layout);
    if (!layout) {
      throw new Error(`Unknown layout: ${data.layout}`);
    }

    const textType = TextType.ALL.find(({ id }) => id === data.textType);
    if (!textType) {
      throw new Error(`Unknown textType: ${data.textType}`);
    }

    const timeStamp = new Date(data.timeStamp).getTime();
    if (isNaN(timeStamp)) {
      throw new Error(`Invalid date format: ${data.timeStamp}`);
    }

    const histogram = new Histogram(data.histogram);

    const result = new Result(
      layout,
      textType,
      timeStamp,
      data.length,
      data.time,
      data.errors,
      histogram,
    );

    results.push(result);
  }

  return results;
}

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

describe("Import duplicate detection", () => {
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
      new Histogram([]),
    );
  };

  test("should detect duplicates by timestamp", () => {
    const timestamp = Date.now();
    const existing = [createResult(timestamp)];
    const imported = [createResult(timestamp)];

    const existingTimestamps = new Set(existing.map((r) => r.timeStamp));
    const newResults = imported.filter(
      (r) => !existingTimestamps.has(r.timeStamp),
    );

    assert.strictEqual(newResults.length, 0);
  });

  test("should merge non-duplicates", () => {
    const timestamp1 = Date.now();
    const timestamp2 = timestamp1 + 1000;

    const existing = [createResult(timestamp1)];
    const imported = [createResult(timestamp2)];

    const existingTimestamps = new Set(existing.map((r) => r.timeStamp));
    const newResults = imported.filter(
      (r) => !existingTimestamps.has(r.timeStamp),
    );

    assert.strictEqual(newResults.length, 1);
    assert.strictEqual(newResults[0].timeStamp, timestamp2);
  });

  test("should handle mixed duplicates and non-duplicates", () => {
    const timestamp1 = Date.now();
    const timestamp2 = timestamp1 + 1000;
    const timestamp3 = timestamp1 + 2000;

    const existing = [createResult(timestamp1), createResult(timestamp2)];
    const imported = [
      createResult(timestamp1), // duplicate
      createResult(timestamp3), // new
    ];

    const existingTimestamps = new Set(existing.map((r) => r.timeStamp));
    const newResults = imported.filter(
      (r) => !existingTimestamps.has(r.timeStamp),
    );

    assert.strictEqual(newResults.length, 1);
    assert.strictEqual(newResults[0].timeStamp, timestamp3);
  });

  test("should handle empty existing results", () => {
    const timestamp = Date.now();
    const existing: Result[] = [];
    const imported = [createResult(timestamp)];

    const existingTimestamps = new Set(existing.map((r) => r.timeStamp));
    const newResults = imported.filter(
      (r) => !existingTimestamps.has(r.timeStamp),
    );

    assert.strictEqual(newResults.length, 1);
  });

  test("should handle empty import", () => {
    const timestamp = Date.now();
    const existing = [createResult(timestamp)];
    const imported: Result[] = [];

    const existingTimestamps = new Set(existing.map((r) => r.timeStamp));
    const newResults = imported.filter(
      (r) => !existingTimestamps.has(r.timeStamp),
    );

    assert.strictEqual(newResults.length, 0);
  });
});
