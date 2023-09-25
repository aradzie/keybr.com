import { Counter } from "./metric.ts";
import { type Result } from "./result.ts";
import { type SummaryStats } from "./types.ts";

export function newSummaryStats(results: readonly Result[]): SummaryStats {
  let totalTime = 0;
  const speed = new Counter();
  const accuracy = new Counter();
  const score = new Counter();

  for (const result of results) {
    totalTime += result.time;
    speed.append(result.speed);
    accuracy.append(result.accuracy);
    score.append(result.score);
  }

  return {
    totalTime,
    speed: speed.toMetric(),
    accuracy: accuracy.toMetric(),
    score: score.toMetric(),
  };
}
