import { useIntlNumbers } from "@keybr/intl";
import { type StreakList as StreakListType } from "@keybr/result";
import { type ClassName, styleTextTruncate, Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export const StreakList = ({
  id,
  className,
  streakList,
}: {
  readonly id?: string;
  readonly className?: ClassName;
  readonly streakList: StreakListType;
}): ReactNode => {
  const { formatPercents } = useIntlNumbers();
  const children = [];
  for (const { level, results } of streakList) {
    if (results.length > 0) {
      if (children.length > 0) {
        children.push(", ");
      }
      children.push(
        <span>
          <FormattedMessage
            id="streakList.streakLength"
            defaultMessage="{length, plural, =1 {One lesson} other {# lessons}} with {accuracy} accuracy."
            values={{
              length: results.length,
              accuracy: <Value value={formatPercents(level)} />,
            }}
          />
        </span>,
      );
    }
  }
  if (children.length === 0) {
    children.push(
      <span className={styleTextTruncate}>
        <FormattedMessage
          id="streakList.noStreaks"
          defaultMessage="No accuracy streaks."
        />
      </span>,
    );
  }
  return (
    <span id={id} className={className}>
      <span className={styleTextTruncate}>{...children}</span>
    </span>
  );
};
