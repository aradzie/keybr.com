import { type Context } from "@fastr/core";
import { NotFoundError } from "@fastr/errors";
import {
  allLocales,
  defaultLocale,
  loadIntl,
  type LocaleId,
  selectLocale,
} from "@keybr/intl";
import { type IntlShape } from "react-intl";

export const localePattern = `(${allLocales
  .filter((locale) => locale !== defaultLocale)
  .join("|")})`;

export async function pIntl(ctx: Context, value: LocaleId): Promise<IntlShape> {
  if (allLocales.includes(value)) {
    return await loadIntl(value);
  } else {
    throw new NotFoundError();
  }
}

export function preferredLocale(ctx: Context): LocaleId {
  return selectLocale((...locales) =>
    ctx.request.negotiateLanguage(...locales),
  );
}
