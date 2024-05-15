import { Key } from "@keybr/lesson-ui";
import { Award } from "@keybr/widget";
import { FormattedMessage } from "react-intl";
import { DailyGoalIcon, TrophyIcon } from "./icons.tsx";
import { type Event } from "./types.ts";

export function EventAlert({ event }: { readonly event: Event }) {
  switch (event.type) {
    case "unlocked-letter":
      return (
        <Award icon={<Key lessonKey={event.lessonKey} size="announcement" />}>
          <FormattedMessage
            id="event.unlockedLetter"
            defaultMessage="New letter unlocked!"
          />
        </Award>
      );
    case "unlocked-all-letters":
      return (
        <Award icon={<TrophyIcon />}>
          <FormattedMessage
            id="event.unlockedAllLetters"
            defaultMessage="All letters unlocked!"
          />
        </Award>
      );
    case "top-speed":
      return (
        <Award icon={<TrophyIcon />}>
          <FormattedMessage id="event.topSpeed" defaultMessage="Top speed!" />
        </Award>
      );
    case "top-score":
      return (
        <Award icon={<TrophyIcon />}>
          <FormattedMessage id="event.topScore" defaultMessage="Top score!" />
        </Award>
      );
    case "accuracy-streak":
      return (
        <Award icon={<TrophyIcon />}>
          <FormattedMessage
            id="event.accuracyStreak"
            defaultMessage="Accuracy streak!"
          />
        </Award>
      );
    case "longest-accuracy-streak":
      return (
        <Award icon={<TrophyIcon />}>
          <FormattedMessage
            id="event.longestAccuracyStreak"
            defaultMessage="Longest accuracy streak!"
          />
        </Award>
      );
    case "daily-goal":
      return (
        <Award icon={<DailyGoalIcon />}>
          <FormattedMessage
            id="event.dailyGoal"
            defaultMessage="Daily goal reached!"
          />
        </Award>
      );
  }
}
