import { Layout } from "@keybr/layout";
import { Result, TextType } from "@keybr/result";
import { Histogram } from "@keybr/textinput";
import isPlainObject from "lodash/isPlainObject";
import isString from "lodash/isString";

export type ResultJson = {
  readonly l: string;
  readonly m: string;
  readonly ts: number;
  readonly n: number;
  readonly t: number;
  readonly e: number;
  readonly h: HistogramtJson;
};

export type HistogramtJson = {
  readonly [codePoint: number]: {
    readonly h: number;
    readonly m: number;
    readonly t: number;
  };
};

export function resultToJson(result: Result): ResultJson {
  return {
    l: result.layout.id,
    m: result.textType.id,
    ts: result.timeStamp,
    n: result.length,
    t: result.time,
    e: result.errors,
    h: histogramToJson(result.histogram),
  };
}

export function histogramToJson(histogram: Histogram): HistogramtJson {
  const json: {
    [codePoint: number]: {
      h: number;
      m: number;
      t: number;
    };
  } = {};
  for (const { codePoint, hitCount, missCount, timeToType } of histogram) {
    json[codePoint] = {
      h: hitCount,
      m: missCount,
      t: timeToType,
    };
  }
  return json;
}

export function resultFromJson(json: ResultJson): Result | null {
  if (!isPlainObject(json)) {
    return null;
  }
  const {
    l: layoutId,
    m: textTypeId,
    ts: timeStamp,
    n: length,
    t: time,
    e: errors,
    h: histogramJson,
  } = json;
  if (
    !(
      isString(layoutId) &&
      isString(textTypeId) &&
      Number.isSafeInteger(timeStamp) &&
      Number.isSafeInteger(length) &&
      Number.isSafeInteger(time) &&
      Number.isSafeInteger(errors)
    )
  ) {
    return null;
  }
  const histogram = histogramFromJson(histogramJson);
  if (histogram == null) {
    return null;
  }
  try {
    return new Result(
      Layout.ALL.get(layoutId),
      TextType.ALL.get(fixTextTypeId(textTypeId)),
      timeStamp,
      length,
      time,
      errors,
      histogram,
    );
  } catch {
    return null;
  }
}

function fixTextTypeId(id: string): string {
  switch (id) {
    case "guided":
      return TextType.GENERATED.id;
    case "custom":
      return TextType.NATURAL.id;
    default:
      return id;
  }
}

export function histogramFromJson(json: HistogramtJson): Histogram | null {
  if (!isPlainObject(json)) {
    return null;
  }
  const samples = [];
  for (const [key, sample] of Object.entries(json)) {
    const codePoint = Number(key);
    if (
      !(Number.isSafeInteger(codePoint) && codePoint > 0 && codePoint <= 65535)
    ) {
      return null;
    }
    if (!isPlainObject(sample)) {
      return null;
    }
    const {
      h: hitCount,
      m: missCount,
      t: timeToType,
    } = sample as {
      readonly h: number;
      readonly m: number;
      readonly t: number;
    };
    if (
      !(
        Number.isSafeInteger(hitCount) &&
        Number.isSafeInteger(missCount) &&
        Number.isFinite(timeToType)
      )
    ) {
      return null;
    }
    samples.push({
      codePoint,
      hitCount,
      missCount,
      timeToType: Math.round(timeToType),
    });
  }
  return new Histogram(samples);
}
