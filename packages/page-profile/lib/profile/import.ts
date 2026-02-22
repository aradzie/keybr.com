import { Layout } from "@keybr/keyboard";
import { Result, TextType } from "@keybr/result";
import { parseFile } from "@keybr/result-io";
import { Histogram } from "@keybr/textinput";

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

/**
 * Deserialize JSON results into Result objects.
 * @throws {Error} If layout or textType is unknown, or if date is invalid.
 */
export function deserializeJsonResults(jsonData: JsonResult[]): Result[] {
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

/**
 * Detect duplicate results based on timestamp.
 * @param existing - Existing results
 * @param imported - Imported results
 * @returns Tuple of [newResults, duplicateCount]
 */
export function detectDuplicates(
  existing: readonly Result[],
  imported: readonly Result[],
): [Result[], number] {
  const existingTimestamps = new Set(existing.map((r) => r.timeStamp));
  const newResults: Result[] = [];
  let duplicateCount = 0;

  for (const result of imported) {
    if (existingTimestamps.has(result.timeStamp)) {
      duplicateCount++;
    } else {
      newResults.push(result);
    }
  }

  return [newResults, duplicateCount];
}

export type ImportFile = {
  type: "json" | "stats";
  name: string;
};

export type ImportedData = {
  results: Result[];
  source: string;
};

/**
 * Import data from a file.
 * @param file - File to import
 * @returns Imported results
 * @throws {Error} If file format is invalid or parsing fails.
 */
export async function importData(file: ImportFile): Promise<ImportedData> {
  if (file.type === "json") {
    // Import from JSON export
    const response = await fetch(file.name);
    if (!response.ok) {
      throw new Error("Failed to read file");
    }
    const jsonData: JsonResult[] = await response.json();
    const results = deserializeJsonResults(jsonData);
    return { results, source: file.name };
  } else {
    // Import from .stats binary file
    const buffer = await fetch(file.name).then((r) => r.arrayBuffer());
    const { results } = await parseFile(buffer);
    return { results, source: file.name };
  }
}
