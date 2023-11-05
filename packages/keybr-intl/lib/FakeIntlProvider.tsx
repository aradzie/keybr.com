import { type ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { defaultLocale } from "./locale.ts";
import { defaultRichTextElements } from "./markup.tsx";

export function FakeIntlProvider({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return (
    <IntlProvider
      locale={defaultLocale}
      timeZone="UTC"
      defaultRichTextElements={defaultRichTextElements}
    >
      {children}
    </IntlProvider>
  );
}
