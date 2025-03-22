import { useIntlNumbers } from "@keybr/intl";
import { useFormattedNames } from "@keybr/keyboard";
import { Pages, UserName } from "@keybr/pages-shared";
import { SpeedUnit } from "@keybr/result";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./HighScoresTable.module.less";
import { type EntriesProps } from "./types.ts";

export function HighScoresTable({ entries }: EntriesProps): ReactNode {
  const { formatNumber } = useIntlNumbers();
  const { formatFullLayoutName } = useFormattedNames();
  const { WPM, CPM } = SpeedUnit;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.positionColumn}>#</th>
          <th className={styles.userColumn}>
            <FormattedMessage id="t_User" defaultMessage="User" />
          </th>
          <th className={styles.layoutColumn}>
            <FormattedMessage id="t_Layout" defaultMessage="Layout" />
          </th>
          <th className={styles.speedColumn}>
            <FormattedMessage id="t_Speed" defaultMessage="Speed" />
          </th>
          <th className={styles.scoreColumn}>
            <FormattedMessage id="t_Score" defaultMessage="Score" />
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ user, layout, speed, score }, index) => {
          const wpm = formatNumber(WPM.measure(speed), 0);
          const cpm = formatNumber(CPM.measure(speed), 0);
          const speedCol = `${wpm}${WPM.id} / ${cpm}${CPM.id}`;
          const scoreCol = formatNumber(score, 0);
          return (
            <tr key={index}>
              <td className={styles.positionColumn}>{index + 1}</td>
              <td className={styles.userColumn}>
                <UserName user={user} path={Pages.profileOf(user)} />
              </td>
              <td className={styles.layoutColumn}>
                {formatFullLayoutName(layout)}
              </td>
              <td className={styles.speedColumn}>{speedCol}</td>
              <td className={styles.scoreColumn}>{scoreCol}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
