import { test } from "node:test";
import { ResultFaker } from "@keybr/result";
import { assert } from "chai";
import {
  histogramFromJson,
  resultFromJson,
  resultToJson,
} from "./legacyjson.ts";

test("deserialize valid JSON", () => {
  const faker = new ResultFaker();
  const result = faker.nextResult();

  const json = resultToJson(result);

  const copy = resultFromJson(json);

  assert.deepStrictEqual(copy, result);
});

test("ignore invalid result JSON", () => {
  const faker = new ResultFaker();
  const json = resultToJson(faker.nextResult());

  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(undefined),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(null),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(""),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(0),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson([]),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson({}),
  );
  assert.isNull(resultFromJson({ ...json, l: "x" }));
  assert.isNull(resultFromJson({ ...json, m: "x" }));
  assert.isNull(resultFromJson({ ...json, ts: 0.1 }));
  assert.isNull(resultFromJson({ ...json, n: 0.1 }));
  assert.isNull(resultFromJson({ ...json, t: 0.1 }));
  assert.isNull(resultFromJson({ ...json, e: 0.1 }));
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson({ ...json, h: null }),
  );
});

test("ignore invalid histogram JSON", () => {
  const faker = new ResultFaker();
  const json = resultToJson(faker.nextResult());

  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(undefined),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(null),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(""),
  );
  assert.isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(0),
  );
  assert.isNull(histogramFromJson([]));
  assert.isNull(histogramFromJson({ ...json.h, 0: { h: 1, m: 1, t: 100 } }));
  assert.isNull(
    histogramFromJson({ ...json.h, 97: { h: 0.1, m: 0.1, t: 100 } }),
  );
});
