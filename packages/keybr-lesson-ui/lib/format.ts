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
  readonly speedUnit: SpeedUnit;
  readonly speedUnitName: string;
  readonly formatSpeed: (value: number, options?: FormatterOptions) => string;
  readonly formatConfidence: (value: number | null) => string;
  readonly formatLearningRate: (lr: LearningRate | null) => string;
};

export const useFormatter = (): Formatter => {
  const { formatMessage } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { settings } = useSettings();
  return useMemo(() => {
    const speedUnit = settings.get(uiProps.speedUnit);
    const speedUnitName = formatMessage(speedUnit.name);
    let opts: FormatNumberOptions;
    switch (speedUnit) {
      case SpeedUnit.WPM:
        opts = f1;
        break;
      case SpeedUnit.WPS:
        opts = f2;
        break;
      case SpeedUnit.CPM:
        opts = f1;
        break;
      case SpeedUnit.CPS:
        opts = f2;
        break;
      default:
        throw new Error();
    }
    const formatSpeed = (
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
    const formatConfidence = (confidence: number | null): string => {
      if (confidence != null) {
        return formatPercents(confidence, 0);
      } else {
        return formatMessage(messages.uncertainValue);
      }
    };
    const formatLearningRate = (lr: LearningRate | null): string => {
      if (lr != null && lr.learningRate === lr.learningRate) {
        return signed(
          formatMessage(messages.learningRateValue, {
            value: formatSpeed(lr.learningRate),
          }),
          lr.learningRate,
        );
      } else {
        return formatMessage(messages.uncertainValue);
      }
    };
    return {
      speedUnit,
      speedUnitName,
      formatSpeed,
      formatConfidence,
      formatLearningRate,
    };
  }, [formatMessage, formatNumber, formatPercents, settings]);
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
