import { Layout } from "@keybr/keyboard";
import { Result, TextType } from "@keybr/result";
import { Histogram } from "@keybr/textinput";

export const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_IMPORT_RESULTS = 10000;

export type JsonResult = {
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

export type DeserializeJsonResultOptions = {
  /**
   * If true, throw an error on any invalid result.
   * If false, skip invalid results and continue.
   * @default false
   */
  strict?: boolean;
  /**
   * Optional callback to track skipped results.
   */
  onSkipped?: (error: Error, data: JsonResult) => void;
};

/**
 * Deserialize JSON results into Result objects.
 * By default, skips invalid results and continues.
 * @throws {Error} If strict mode is enabled and an error occurs.
 */
export function deserializeJsonResults(
  jsonData: JsonResult[],
  options: DeserializeJsonResultOptions = {},
): Result[] {
  const { strict = false, onSkipped } = options;
  const results: Result[] = [];

  for (const data of jsonData) {
    try {
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
    } catch (err) {
      if (strict) {
        throw err;
      }
      onSkipped?.(err as Error, data);
    }
  }

  return results;
}
