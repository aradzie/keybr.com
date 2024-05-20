import { useIntlNumbers } from "@keybr/intl";
import { type StreakList as StreakListType } from "@keybr/result";
import { type ClassName, styleTextTruncate, Value } from "@keybr/widget";
import { type ReactNode } from "react";

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
          {results.length} lessons at <Value value={formatPercents(level)} />{" "}
          accuracy
        </span>,
      );
    }
  }
  if (children.length === 0) {
    children.push(
      <span className={styleTextTruncate}>No accuracy streaks.</span>,
    );
  }
  return (
    <span id={id} className={className}>
      <span className={styleTextTruncate}>{...children}</span>
    </span>
  );
};
