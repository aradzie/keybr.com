import { useIntlNumbers } from "@keybr/intl";
import { useFormattedNames } from "@keybr/keyboard";
import { Sitemap, UserName } from "@keybr/pages-shared";
import { SpeedUnit } from "@keybr/result";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./HighScoresTable.module.less";
import { type HighScoresEntry } from "./model.ts";

export function HighScoresTable({
  entries,
}: {
  readonly entries: readonly HighScoresEntry[];
}): ReactNode {
  const { formatNumber } = useIntlNumbers();
  const { formatFullLayoutName } = useFormattedNames();
  const { WPM, CPM } = SpeedUnit;
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.positionColumn}>#</th>
          <th className={styles.userColumn}>
            <FormattedMessage
              id="highScores.column.user.label"
              defaultMessage="User"
            />
          </th>
          <th className={styles.layoutColumn}>
            <FormattedMessage
              id="highScores.column.layout.label"
              defaultMessage="Layout"
            />
          </th>
          <th className={styles.speedColumn}>
            <FormattedMessage
              id="highScores.column.speed.label"
              defaultMessage="Typing Speed"
            />
          </th>
          <th className={styles.scoreColumn}>
            <FormattedMessage
              id="highScores.column.score.label"
              defaultMessage="Score"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ user, layout, speed, score }, index) => {
          let link = null;
          if (user.id != null) {
            link = Sitemap.publicProfile.bind(user);
          }
          const wpm = formatNumber(WPM.measure(speed), 0);
          const cpm = formatNumber(CPM.measure(speed), 0);
          const speedCol = `${wpm}${WPM.id} / ${cpm}${CPM.id}`;
          const scoreCol = formatNumber(score, 0);
          return (
            <tr key={index}>
              <td className={styles.positionColumn}>{index + 1}</td>
              <td className={styles.userColumn}>
                <UserName user={user} link={link} />
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
