import { type IntlShape, useIntl } from "react-intl";

export type IntlDisplayNames = {
  formatRegionName(id: string): string;
  formatLanguageName(id: string): string;
  formatLocalLanguageName(id: string): string;
};

const kIntlDisplayNames = Symbol("kIntlDisplayNames");

export const makeIntlDisplayNames = (intl: IntlShape): IntlDisplayNames => {
  let r = (intl as any)[kIntlDisplayNames] as IntlDisplayNames;
  if (r == null) {
    const { locale } = intl;
    const capitalize = (value: string, locale: string): string =>
      value.substring(0, 1).toLocaleUpperCase(locale) +
      value.substring(1).toLocaleLowerCase(locale);
    (intl as any)[kIntlDisplayNames] = r = {
      formatRegionName(id: string): string {
        const dn = intl.formatters.getDisplayNames(locale, {
          type: "region",
          fallback: "none",
        });
        return capitalize(dn.of(id) || "", locale) ?? id;
      },
      formatLanguageName(id: string): string {
        const dn = intl.formatters.getDisplayNames(locale, {
          type: "language",
          fallback: "none",
        });
        return capitalize(dn.of(id) || "", locale) || id;
      },
      formatLocalLanguageName(id: string): string {
        const dn = intl.formatters.getDisplayNames(id, {
          type: "language",
          fallback: "none",
        });
        return capitalize(dn.of(id) || "", id) || id;
      },
    } satisfies IntlDisplayNames;
  }
  return r;
};

export const useIntlDisplayNames = (): IntlDisplayNames => {
  return makeIntlDisplayNames(useIntl());
};
