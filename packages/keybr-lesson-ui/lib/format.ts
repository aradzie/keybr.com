import { useIntlNumbers } from "@keybr/intl";
import { SpeedUnit, useSettings } from "@keybr/settings";
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
  readonly speedUnit: SpeedUnit;
  readonly speedUnitName: string;
};

export const useFormatter = (): Formatter => {
  const { formatMessage } = useIntl();
  const { formatNumber } = useIntlNumbers();
  const { settings } = useSettings();
  return useMemo(() => {
    const { speedUnit } = settings;
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
    formatter.speedUnit = speedUnit;
    formatter.speedUnitName = speedUnitName;
    return formatter;
  }, [formatMessage, formatNumber, settings]);
};
