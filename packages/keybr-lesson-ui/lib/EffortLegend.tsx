import { useIntlNumbers } from "@keybr/intl";
import { FormattedMessage } from "react-intl";
import { type Effort } from "./effort.ts";
import * as styles from "./EffortLegent.module.less";

export function EffortLegend({ effort }: { effort: Effort }) {
  const { formatPercents } = useIntlNumbers();
  return (
    <>
      <FormattedMessage
        id="settings.dailyGoal.label"
        defaultMessage="Daily goal:"
      />{" "}
      {[1.0, 0.75, 0.5, 0.25, 0.0].map((value) => (
        <span key={value} className={styles.cell}>
          <span
            className={styles.item}
            style={{ backgroundColor: String(effort.shade(value)) }}
          >
            {formatPercents(value)}
          </span>
        </span>
      ))}
    </>
  );
}
