import { useIntlNumbers } from "@keybr/intl";
import { type KeyboardStats } from "@keybr/keyboard";
import { Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export function KeyboardStats({
  stats: { homeRow, topRow, bottomRow, handSwitches, fingerSwitches },
}: {
  readonly stats: KeyboardStats;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatPercents } = useIntlNumbers();
  return (
    <ul>
      <li
        title={formatMessage({
          id: "layouts.stats.homeRowKeys.description",
          defaultMessage:
            "The percentage of keys typed without leaving the Caps Lock row, the more the better.",
        })}
      >
        <FormattedMessage
          id="layouts.stats.homeRowKeys.name"
          defaultMessage="Keys on the home row:"
        />{" "}
        <Value value={formatPercents(homeRow, 0)} />
      </li>
      <li
        title={formatMessage({
          id: "layouts.stats.topRowKeys.description",
          defaultMessage:
            "The percentage of keys typed on the Tab row, the less the better.",
        })}
      >
        <FormattedMessage
          id="layouts.stats.topRowKeys.name"
          defaultMessage="Keys on the top row:"
        />{" "}
        <Value value={formatPercents(topRow, 0)} />
      </li>
      <li
        title={formatMessage({
          id: "layouts.stats.bottomRowKeys.description",
          defaultMessage:
            "The percentage of keys typed on the Shift row, the less the better.",
        })}
      >
        <FormattedMessage
          id="layouts.stats.bottomRowKeys.name"
          defaultMessage="Keys on the bottom row:"
        />{" "}
        <Value value={formatPercents(bottomRow, 0)} />
      </li>
      <li
        title={formatMessage({
          id: "layouts.stats.sameHandKeys.description",
          defaultMessage:
            "The percentage of keys typed by the same hand, the less the better.",
        })}
      >
        <FormattedMessage
          id="layouts.stats.sameHandKeys.name"
          defaultMessage="Keys typed by the same hand:"
        />{" "}
        <Value value={formatPercents(1 - handSwitches, 0)} />
      </li>
      <li
        title={formatMessage({
          id: "layouts.stats.sameFingerKeys.description",
          defaultMessage:
            "The percentage of keys typed by the same finger, the less the better.",
        })}
      >
        <FormattedMessage
          id="layouts.stats.sameFingerKeys.name"
          defaultMessage="Keys typed by the same finger:"
        />{" "}
        <Value value={formatPercents(1 - fingerSwitches, 0)} />
      </li>
    </ul>
  );
}
