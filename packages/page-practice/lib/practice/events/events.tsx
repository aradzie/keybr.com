import { type Lesson, lessonProps } from "@keybr/lesson";
import {
  computeDailyGoal,
  LocalDate,
  type Result,
  ResultGroups,
} from "@keybr/result";
import { type Settings } from "@keybr/settings";
import { toast } from "@keybr/widget";
import { useMemo } from "react";
import { EventAlert } from "./EventAlert.tsx";
import { type Event, type EventListener } from "./types.ts";

export function makeEvents(settings: Settings, lesson: Lesson) {
  const results: Result[] = [];

  let topSpeed = 0;
  let topScore = 0;
  let accuracyStreak = 0;
  let longestAccuracyStreak = 0;
  let prevDailyGoal = 0;

  const getDailyGoal = () => {
    const today = ResultGroups.byDate(results).get(LocalDate.now());
    const dailyGoal = settings.get(lessonProps.dailyGoal);
    const { value } = computeDailyGoal(today, dailyGoal);
    return value;
  };

  return new (class {
    get length(): number {
      return results.length;
    }

    appendAll(results: readonly Result[]): void {
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

      if (result.accuracy === 1) {
        accuracyStreak += 1;
      } else {
        if (accuracyStreak >= 3) {
          if (accuracyStreak > longestAccuracyStreak) {
            if (listener != null) {
              listener({
                type: "longest-accuracy-streak",
                length: accuracyStreak,
                previous: longestAccuracyStreak,
              });
            }
            longestAccuracyStreak = accuracyStreak;
          } else {
            if (listener != null) {
              listener({
                type: "accuracy-streak",
                length: accuracyStreak,
              });
            }
          }
        }
        accuracyStreak = 0;
      }

      const dailyGoal = getDailyGoal();
      if (prevDailyGoal < 1 && dailyGoal >= 1) {
        if (listener != null) {
          listener({
            type: "daily-goal",
          });
        }
      }
      prevDailyGoal = dailyGoal;
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
