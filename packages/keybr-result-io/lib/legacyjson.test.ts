import { ResultFaker } from "@keybr/result";
import test from "ava";
import {
  histogramFromJson,
  resultFromJson,
  resultToJson,
} from "./legacyjson.ts";

test("deserialize valid JSON", (t) => {
  const faker = new ResultFaker();
  const result = faker.nextResult();

  const json = resultToJson(result);

  const copy = resultFromJson(json);

  t.deepEqual(copy, result);
});

test("ignore invalid result JSON", (t) => {
  const faker = new ResultFaker();
  const json = resultToJson(faker.nextResult());

  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(undefined),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(null),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(""),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson(0),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson([]),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson({}),
    null,
  );
  t.is(resultFromJson({ ...json, l: "x" }), null);
  t.is(resultFromJson({ ...json, m: "x" }), null);
  t.is(resultFromJson({ ...json, ts: 0.1 }), null);
  t.is(resultFromJson({ ...json, n: 0.1 }), null);
  t.is(resultFromJson({ ...json, t: 0.1 }), null);
  t.is(resultFromJson({ ...json, e: 0.1 }), null);
  t.is(
    // @ts-expect-error Test invalid arguments.
    resultFromJson({ ...json, h: null }),
    null,
  );
});

test("ignore invalid histogram JSON", (t) => {
  const faker = new ResultFaker();
  const json = resultToJson(faker.nextResult());

  t.is(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(undefined),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(null),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(""),
    null,
  );
  t.is(
    // @ts-expect-error Test invalid arguments.
    histogramFromJson(0),
    null,
  );
  t.is(histogramFromJson([]), null);
  t.is(histogramFromJson({ ...json.h, 0: { h: 1, m: 1, t: 100 } }), null);
  t.is(histogramFromJson({ ...json.h, 97: { h: 0.1, m: 0.1, t: 100 } }), null);
});
