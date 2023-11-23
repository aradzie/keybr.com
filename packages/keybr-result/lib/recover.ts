import { Histogram, validateSample } from "@keybr/textinput";
import { Result } from "./result.ts";

/**
 * Fixes the validation errors in the given results, if possible.
 */
export function recoverResults(raw: readonly Result[]): Result[] {
  const results: Result[] = [];
  for (const result of raw) {
    if (result.validate()) {
      results.push(result);
    } else {
      const recovered = new Result(
        result.layout,
        result.textType,
        result.timeStamp,
        result.length,
        result.time,
        result.errors,
        new Histogram([...result.histogram].filter(validateSample)),
      );
      if (recovered.validate()) {
        results.push(recovered);
      }
    }
  }
  return results;
}
