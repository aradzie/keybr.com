import { type FormatNumberOptions, type IntlShape, useIntl } from "react-intl";

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

const kIntlNumbers = Symbol("kIntlNumbers");

export const makeIntlNumbers = (intl: IntlShape): IntlNumbers => {
  let r = (intl as any)[kIntlNumbers] as IntlNumbers;
  if (r == null) {
    (intl as any)[kIntlNumbers] = r = {
      formatInteger: (value: number): string => {
        return intl.formatNumber(value, formatIntegerOpts);
      },
      formatNumber: (
        value: number,
        opts: number | FormatNumberOptions = formatNumberOpts,
      ): string => {
        if (typeof opts === "number") {
          opts = {
            maximumFractionDigits: opts,
          };
        }
        return intl.formatNumber(value, opts);
      },
      formatPercents: (
        value: number,
        opts: number | FormatNumberOptions = formatPercentsOpts,
      ): string => {
        if (typeof opts === "number") {
          opts = {
            style: "percent",
            maximumFractionDigits: opts,
          };
        }
        return intl.formatNumber(value, opts);
      },
    } satisfies IntlNumbers;
  }
  return r;
};

export const useIntlNumbers = (): IntlNumbers => {
  return makeIntlNumbers(useIntl());
};
