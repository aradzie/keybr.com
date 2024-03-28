import {
  computeStats,
  type Keyboard,
  useFormattedNames,
} from "@keybr/keyboard";
import {
  HeatmapLayer,
  KeyboardStats,
  KeyLayer,
  VirtualKeyboard,
} from "@keybr/keyboard-ui";
import { Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { englishN1, englishN2 } from "./english.ts";

export function KeyFrequencyHeatmap({
  keyboard,
}: {
  readonly keyboard: Keyboard;
}): ReactNode {
  const { formatFullLayoutName } = useFormattedNames();
  return (
    <Figure>
      <Figure.Caption>
        <FormattedMessage
          id="layouts.heatmap.caption"
          defaultMessage="Key Frequency Heatmap for {name}"
          values={{ name: formatFullLayoutName(keyboard.layout) }}
        />
      </Figure.Caption>

      <Figure.Description>
        <FormattedMessage
          id="layouts.heatmap.description"
          defaultMessage="This chart shows relative key frequencies as a heatmap."
        />
      </Figure.Description>

      <KeyboardStats stats={computeStats(keyboard, englishN1, englishN2)} />

      <VirtualKeyboard keyboard={keyboard}>
        <KeyLayer />
        <HeatmapLayer
          histogram={[...englishN1].map(({ a, f }) => [{ codePoint: a }, f])}
          modifier="f"
        />
      </VirtualKeyboard>
    </Figure>
  );
}
