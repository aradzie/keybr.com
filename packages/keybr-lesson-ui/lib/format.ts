import { useIntlNumbers } from "@keybr/intl";
import { type LearningRate } from "@keybr/lesson";
import { SpeedUnit, uiProps } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { useMemo } from "react";
import { type FormatNumberOptions, useIntl } from "react-intl";
import { messages } from "./intl.ts";

const f1 = { minimumFractionDigits: 1, maximumFractionDigits: 1 };
const f2 = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

export type FormatterOptions = {
  readonly unit?: boolean;
};

export type Formatter = {
  (value: number, options?: FormatterOptions): string;
  readonly confidence: (value: number | null) => string;
  readonly learningRate: (lr: LearningRate | null) => string;
  readonly speedUnit: SpeedUnit;
  readonly speedUnitName: string;
};

export const useFormatter = (): Formatter => {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { settings } = useSettings();
  return useMemo(() => {
    const speedUnit = settings.get(uiProps.speedUnit);
    let opts: FormatNumberOptions;
    let speedUnitName: string;
    switch (speedUnit) {
      case SpeedUnit.WPM:
        opts = f1;
        speedUnitName = formatMessage(messages.wpmName);
        break;
      case SpeedUnit.CPM:
        opts = f1;
        speedUnitName = formatMessage(messages.cpmName);
        break;
      case SpeedUnit.CPS:
        opts = f2;
        speedUnitName = formatMessage(messages.cpsName);
        break;
      default:
        throw new Error();
    }
    const formatter = (
      value: number,
      { unit = true }: FormatterOptions = {},
    ): string => {
      const s = formatNumber(speedUnit.measure(value), opts);
      if (unit) {
        return s + speedUnit.id;
      } else {
        return s;
      }
    };
    formatter.confidence = (confidence: number | null): string => {
      if (confidence != null) {
        return formatNumber(confidence, 2);
      } else {
        return formatMessage(messages.uncertainValue);
      }
    };
    formatter.learningRate = (lr: LearningRate | null): string => {
      if (lr != null && lr.learningRate === lr.learningRate) {
        return signed(
          formatMessage(messages.learningRateValue, {
            learningRate: formatter(lr.learningRate),
          }),
          lr.learningRate,
        );
      } else {
        return formatMessage(messages.uncertainValue);
      }
    };
    formatter.speedUnit = speedUnit;
    formatter.speedUnitName = speedUnitName;
    return formatter;
  }, [formatMessage, formatNumber, settings]);
};

function signed(value: any, learningRate: number): string {
  // https://unicode.org/emoji/charts/full-emoji-list.html
  // https://www.codejam.info/2021/11/emoji-variation-selector.html
  // https://en.wikipedia.org/wiki/Variation_Selectors_(Unicode_block)
  const s = String(value);
  if (learningRate >= 10) {
    return `+${s} 🙂\uFE0E🙂\uFE0E🙂\uFE0E`;
  }
  if (learningRate >= 5) {
    return `+${s} 🙂\uFE0E🙂\uFE0E`;
  }
  if (learningRate > 0) {
    return `+${s} 🙂\uFE0E`;
  }
  if (learningRate <= -10) {
    return `${s} 🙁\uFE0E🙁\uFE0E🙁\uFE0E`;
  }
  if (learningRate <= -5) {
    return `${s} 🙁\uFE0E🙁\uFE0E`;
  }
  if (learningRate < 0) {
    return `${s} 🙁\uFE0E`;
  }
  return `${s}`;
}
