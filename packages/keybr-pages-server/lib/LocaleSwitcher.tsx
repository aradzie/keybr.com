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

  const children: ReactNode[] = [];
  for (const localeId of allLocales) {
    if (children.length > 0) {
      children.push(" ");
    }
    children.push(
      <Link
        key={localeId}
        href={currentLink.formatPath(localeId)}
        title={formatMessage(languageName(localeId))}
      >
        {localeId}
      </Link>,
    );
  }

  return <span>{children}</span>;
}
