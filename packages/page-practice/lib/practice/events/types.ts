import { type LessonKey } from "@keybr/lesson";

export type Event =
  | {
      readonly type: "unlocked-letter";
      readonly lessonKey: LessonKey;
    }
  | {
      readonly type: "top-speed";
      readonly speed: number;
      readonly previous: number;
    }
  | {
      readonly type: "top-score";
      readonly score: number;
      readonly previous: number;
    }
  | {
      readonly type: "daily-goal";
    };

export type EventListener = (event: Event) => void;
