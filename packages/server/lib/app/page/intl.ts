import { type Context } from "@fastr/core";
import { NotFoundError } from "@fastr/errors";
import {
  allLocales,
  defaultLocale,
  loadIntl,
  type LocaleId,
} from "@keybr/intl";
import { type IntlShape } from "react-intl";

export const localePattern = `(${allLocales
  .filter((locale) => locale !== defaultLocale)
  .join("|")})`;

export const pIntl = async (
  ctx: Context,
  value: LocaleId,
): Promise<IntlShape> => {
  if (allLocales.includes(value)) {
    return await loadIntl(value);
  } else {
    throw new NotFoundError();
  }
};
