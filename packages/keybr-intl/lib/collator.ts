import { type IntlShape, useIntl } from "react-intl";
import { intlMemo } from "./memo.ts";

const factory = ({ locale }: IntlShape): Intl.Collator => {
  return new Intl.Collator(locale);
};

export const makeIntlCollator = intlMemo(Symbol("collator"), factory);

export const useCollator = (): Intl.Collator => {
  return makeIntlCollator(useIntl());
};
