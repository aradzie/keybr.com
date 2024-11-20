import { test } from "node:test";
import { ResultFaker } from "@keybr/result";
import { deepEqual, isNull } from "rich-assert";
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

  deepEqual(copy, result);
});

test("ignore invalid result JSON", () => {
  const faker = new ResultFaker();
  const json = resultToJson(faker.nextResult());

  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(undefined),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(null),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(""),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(0),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson([]),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson({}),
  );
  isNull(resultFromJson({ ...json, l: "x" }));
  isNull(resultFromJson({ ...json, m: "x" }));
  isNull(resultFromJson({ ...json, ts: 0.1 }));
  isNull(resultFromJson({ ...json, n: 0.1 }));
  isNull(resultFromJson({ ...json, t: 0.1 }));
  isNull(resultFromJson({ ...json, e: 0.1 }));
  isNull(
    // @ts-expect-error Test invalid arguments.
    resultFromJson({ ...json, h: null }),
  );
});

test("ignore invalid histogram JSON", () => {
  const faker = new ResultFaker();
  const json = resultToJson(faker.nextResult());

  isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(undefined),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(null),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(""),
  );
  isNull(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(0),
  );
  isNull(histogramFromJson([]));
  isNull(histogramFromJson({ ...json.h, 0: { h: 1, m: 1, t: 100 } }));
  isNull(histogramFromJson({ ...json.h, 97: { h: 0.1, m: 0.1, t: 100 } }));
});
