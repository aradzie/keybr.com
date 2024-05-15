import { Icon, styleCover } from "@keybr/widget";
import { mdiAlarmCheck, mdiTrophy } from "@mdi/js";
import { clsx } from "clsx";
import * as styles from "./event-icons.module.less";

export function TrophyIcon() {
  return (
    <Icon shape={mdiTrophy} className={clsx(styles.trophyIcon, styleCover)} />
  );
}

export function DailyGoalIcon() {
  return <Icon shape={mdiAlarmCheck} className={clsx(styleCover)} />;
}
