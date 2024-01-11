import { type IntlShape, useIntl } from "react-intl";

export type IntlDisplayNames = {
  formatRegionName(id: string): string;
  formatLanguageName(id: string): string;
};

const kIntlDisplayNames = Symbol("kIntlDisplayNames");

export const makeIntlDisplayNames = (intl: IntlShape): IntlDisplayNames => {
  let r = (intl as any)[kIntlDisplayNames] as IntlDisplayNames;
  if (r == null) {
    const { locale } = intl;
    const capitalize = (v: string): string =>
      v.substring(0, 1).toLocaleUpperCase(locale) + v.substring(1);
    (intl as any)[kIntlDisplayNames] = r = {
      formatRegionName(id: string): string {
        const dn = intl.formatters.getDisplayNames(locale, {
          type: "region",
          fallback: "none",
        });
        return capitalize(dn.of(id) || "") ?? id;
      },
      formatLanguageName(id: string): string {
        const dn = intl.formatters.getDisplayNames(locale, {
          type: "language",
          fallback: "none",
        });
        const name = capitalize(dn.of(id) || "") || id;
        if (locale === id || locale.startsWith(id)) {
          return name;
        } else {
          const localDn = intl.formatters.getDisplayNames(id, {
            type: "language",
            fallback: "none",
          });
          const localName = capitalize(localDn.of(id) || "") || id;
          return `${name} (${localName})`;
        }
      },
    } satisfies IntlDisplayNames;
  }
  return r;
};

export const useIntlDisplayNames = (): IntlDisplayNames => {
  return makeIntlDisplayNames(useIntl());
};
