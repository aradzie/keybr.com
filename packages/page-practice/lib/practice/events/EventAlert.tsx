import { Key } from "@keybr/lesson-ui";
import { Award } from "@keybr/widget";
import { DailyGoalIcon, TrophyIcon } from "./icons.tsx";
import { type Event } from "./types.ts";

export function EventAlert({ event }: { readonly event: Event }) {
  switch (event.type) {
    case "unlocked-letter":
      return (
        <Award icon={<Key lessonKey={event.lessonKey} size="announcement" />}>
          New letter unlocked!
        </Award>
      );
    case "unlocked-all-letters":
      return <Award icon={<TrophyIcon />}>All letters unlocked!</Award>;
    case "top-speed":
      return <Award icon={<TrophyIcon />}>Top speed!</Award>;
    case "top-score":
      return <Award icon={<TrophyIcon />}>Top score!</Award>;
    case "accuracy-streak":
      return <Award icon={<TrophyIcon />}>Accuracy streak!</Award>;
    case "longest-accuracy-streak":
      return <Award icon={<TrophyIcon />}>Longest accuracy streak!</Award>;
    case "daily-goal":
      return <Award icon={<DailyGoalIcon />}>Daily goal reached!</Award>;
  }
}
