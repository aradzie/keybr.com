import { type LessonKey } from "@keybr/lesson";
import { type Result } from "@keybr/result";

export type NewLetterEvent = {
  readonly type: "new-letter";
  readonly lessonKey: LessonKey;
};

export type TopSpeedEvent = {
  readonly type: "top-speed";
  readonly speed: number;
  readonly previous: number;
};

export type TopScoreEvent = {
  readonly type: "top-score";
  readonly score: number;
  readonly previous: number;
};

export type DailyGoalEvent = {
  readonly type: "daily-goal";
};

export type LessonEvent =
  | NewLetterEvent
  | TopSpeedEvent
  | TopScoreEvent
  | DailyGoalEvent;

export type LessonEventListener = (event: LessonEvent) => void;

export type LessonEventSource = {
  append(result: Result, listener: LessonEventListener): void;
};
