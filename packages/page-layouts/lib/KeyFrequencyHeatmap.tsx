import { useIntlNumbers } from "@keybr/intl";
import { type Keyboard, useFormattedNames } from "@keybr/keyboard";
import { HeatmapLayer, KeyLayer, VirtualKeyboard } from "@keybr/keyboard-ui";
import { Figure, Value } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { bigrams, letters } from "./english.ts";
import {
  bottomRowKeys,
  homeRowKeys,
  leftHandKeys,
  rightHandKeys,
  topRowKeys,
} from "./geometry.ts";
import { fingerSwitches, handSwitches, keysOnRow } from "./stats.ts";

export function KeyFrequencyHeatmap({
  keyboard,
}: {
  keyboard: Keyboard;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatPercents } = useIntlNumbers();
  const { formatLayoutName } = useFormattedNames();
  const homeRow = keysOnRow(letters, keyboard, homeRowKeys);
  const topRow = keysOnRow(letters, keyboard, topRowKeys);
  const bottomRow = keysOnRow(letters, keyboard, bottomRowKeys);
  const sameHand =
    1 - handSwitches(bigrams, keyboard, leftHandKeys, rightHandKeys);
  const sameFinger = 1 - fingerSwitches(bigrams, keyboard);

  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="layouts.heatmap.caption"
          defaultMessage="Key Frequency Heatmap for {name}"
          values={{ name: formatLayoutName(keyboard.layout) }}
        />
      </Figure.Caption>

      <Figure.Description>
        <FormattedMessage
          id="layouts.heatmap.description"
          defaultMessage="This chart shows relative key frequencies as a heatmap."
        />
      </Figure.Description>

      <ul>
        <li
          title={formatMessage({
            id: "layouts.stats.homeRowKeys.description",
            defaultMessage:
              "Percentage of keys typed without leaving the Caps Lock row, the more the better.",
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
              "Percentage of keys typed on the Tab row, the less the better.",
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
              "Percentage of keys typed on the Shift row, the less the better.",
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
              "Percentage of keys typed by the same hand, the less the better.",
          })}
        >
          <FormattedMessage
            id="layouts.stats.sameHandKeys.name"
            defaultMessage="Keys typed by the same hand:"
          />{" "}
          <Value value={formatPercents(sameHand, 0)} />
        </li>
        <li
          title={formatMessage({
            id: "layouts.stats.sameFingerKeys.description",
            defaultMessage:
              "Percentage of keys typed by the same finger, the less the better.",
          })}
        >
          <FormattedMessage
            id="layouts.stats.sameFingerKeys.name"
            defaultMessage="Keys typed by the same finger:"
          />{" "}
          <Value value={formatPercents(sameFinger, 0)} />
        </li>
      </ul>

      <VirtualKeyboard keyboard={keyboard}>
        <KeyLayer />
        <HeatmapLayer
          histogram={letters.map((letter) => [letter, letter.f])}
          modifier="f"
        />
      </VirtualKeyboard>
    </Figure>
  );
}
