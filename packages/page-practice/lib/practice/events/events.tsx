import { type DailyGoal, type Lesson, makeDailyGoal } from "@keybr/lesson";
import { type Result } from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { toast } from "@keybr/widget";
import { useMemo } from "react";
import { EventAlert } from "./EventAlert.tsx";
import { type Event, type EventListener } from "./types.ts";

export function makeEvents(settings: Settings, lesson: Lesson) {
  const results: Result[] = [];

  let topSpeed = 0;
  let topScore = 0;
  let dailyGoal = { goal: 0, value: 0 } as DailyGoal;

  return new (class {
    get length(): number {
      return results.length;
    }

    init(results: readonly Result[]): void {
      for (const result of results) {
        this.append(result);
      }
    }

    append(result: Result, listener: EventListener | null = null): void {
      results.push(result);

      const { speed } = result;
      if (speed > topSpeed) {
        if (results.length >= 3) {
          if (listener != null) {
            listener({
              type: "top-speed",
              speed,
              previous: topSpeed,
            });
          }
        }
        topSpeed = speed;
      }

      const { score } = result;
      if (score > topScore) {
        if (results.length >= 3) {
          if (listener != null) {
            listener({
              type: "top-score",
              score,
              previous: topScore,
            });
          }
        }
        topScore = score;
      }

      const newDailyGoal = makeDailyGoal(settings, results);
      if (dailyGoal.value < 1 && newDailyGoal.value >= 1) {
        if (listener != null) {
          listener({
            type: "daily-goal",
          });
        }
      }
      dailyGoal = newDailyGoal;
    }
  })();
}

export function useEvents(settings: Settings, lesson: Lesson) {
  return useMemo(() => makeEvents(settings, lesson), [settings, lesson]);
}

export function displayEvent(event: Event): void {
  toast(<EventAlert event={event} />, {
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
  });
}
