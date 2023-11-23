import { allLocales, languageName } from "@keybr/intl";
import { type BoundPageLink } from "@keybr/pages-shared";
import { Link } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function LocaleSwitcher({
  currentLink,
}: {
  readonly currentLink: BoundPageLink;
}): ReactNode {
  const { formatMessage } = useIntl();
  const children = [];
  for (const locale of allLocales) {
    if (children.length > 0) {
      children.push(" ");
    }
    children.push(
      <Link
        key={locale}
        href={currentLink.formatPath(locale)}
        title={formatMessage(languageName(locale))}
      >
        {locale}
      </Link>,
    );
  }
  return <span>{children}</span>;
}
