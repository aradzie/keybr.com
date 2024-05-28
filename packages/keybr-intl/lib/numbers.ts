import { type FormatNumberOptions, type IntlShape, useIntl } from "react-intl";
import { intlMemo } from "./memo.ts";

export type IntlNumbers = {
  formatInteger(value: number): string;
  formatNumber(value: number, opts?: number | FormatNumberOptions): string;
  formatPercents(value: number, opts?: number | FormatNumberOptions): string;
};

const formatIntegerOpts = {
  maximumFractionDigits: 0,
} satisfies FormatNumberOptions;

const formatNumberOpts = {
  maximumFractionDigits: 3,
} satisfies FormatNumberOptions;

const formatPercentsOpts = {
  style: "percent",
  maximumFractionDigits: 2,
} satisfies FormatNumberOptions;

const factory = (intl: IntlShape): IntlNumbers => {
  const formatInteger = (value: number): string => {
    return intl.formatNumber(value, formatIntegerOpts);
  };
  const formatNumber = (
    value: number,
    opts: number | FormatNumberOptions = formatNumberOpts,
  ): string => {
    if (typeof opts === "number") {
      opts = {
        maximumFractionDigits: opts,
      };
    }
    return intl.formatNumber(value, opts);
  };
  const formatPercents = (
    value: number,
    opts: number | FormatNumberOptions = formatPercentsOpts,
  ): string => {
    if (typeof opts === "number") {
      opts = {
        style: "percent",
        maximumFractionDigits: opts,
      };
    }
    // Do not round up to 100% if the value is less than one.
    // Add decimal digits instead.
    let s = intl.formatNumber(value, opts);
    for (let i = opts.maximumFractionDigits ?? 0; i <= 5; i++) {
      if (value < 1.0 && s === intl.formatNumber(1.0, opts)) {
        opts = {
          ...opts,
          maximumFractionDigits: i + 1,
        };
        s = intl.formatNumber(value, opts);
      } else {
        break;
      }
    }
    return s;
  };
  return {
    formatInteger,
    formatNumber,
    formatPercents,
  };
};

export const makeIntlNumbers = intlMemo(Symbol("numbers"), factory);

export const useIntlNumbers = (): IntlNumbers => {
  return makeIntlNumbers(useIntl());
};
