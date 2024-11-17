import { type Color, parseColor } from "@keybr/color";
import { MutableDailyGoal } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { useComputedStyles } from "@keybr/themes";
import { useMemo } from "react";

export type Effort = {
  readonly effort: (time: number) => number;
  readonly shade: (effort: number) => Color;
};

export function useEffort(): Effort {
  const { settings } = useSettings();
  const { getPropertyValue } = useComputedStyles();
  const color = getPropertyValue("--effort-color") || "#000000";
  return useMemo(() => {
    const dailyGoal = new MutableDailyGoal(settings);
    const effort = (time: number) => {
      return dailyGoal.goal > 0 ? dailyGoal.measure(time) : 1.0;
    };
    const shade = (effort: number) => {
      return parseColor(color).fade(effort);
    };
    return { effort, shade };
  }, [settings, color]);
}
