import { type IntlShape, useIntl } from "react-intl";

const kIntlCollator = Symbol("kIntlCollator");

export const makeIntlCollator = (intl: IntlShape): Intl.Collator => {
  let r = (intl as any)[kIntlCollator] as Intl.Collator;
  if (r == null) {
    const { locale } = intl;
    (intl as any)[kIntlCollator] = r = new Intl.Collator(locale);
  }
  return r;
};

export const useCollator = (): Intl.Collator => {
  return makeIntlCollator(useIntl());
};
