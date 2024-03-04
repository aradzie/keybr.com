import { allLocales, useIntlDisplayNames } from "@keybr/intl";
import {
  type BoundPageLink,
  isPremiumUser,
  PageLink,
  Sitemap,
  usePageData,
} from "@keybr/pages-shared";
import { Link } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import * as styles from "./SecondaryMenu.module.less";

export function SecondaryMenu({
  currentLink,
}: {
  readonly currentLink: BoundPageLink;
}): ReactNode {
  return (
    <div className={styles.secondaryMenu}>
      <MailLink />
      <DiscordLink />
      <GithubLink />
      <PageLink link={Sitemap.termsOfService.bind(null)} />
      <PageLink link={Sitemap.privacyPolicy.bind(null)} />
      <LocaleSwitcher currentLink={currentLink} />
      <TranslateLink />
      <RemoveAdsLink />
    </div>
  );
}

function MailLink(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <Link
      href="mailto:info@keybr.com"
      target="email"
      title={formatMessage({
        id: "footer.emailLink.description",
        defaultMessage: "Send your comments and suggestions to info@keybr.com",
      })}
    >
      info@keybr.com
    </Link>
  );
}

function DiscordLink(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <Link
      href="https://discord.gg/gY4RA4enVH"
      target="discord"
      title={formatMessage({
        id: "footer.discordLink.description",
        defaultMessage: "Discuss on our Discord server.",
      })}
    >
      Discord
    </Link>
  );
}

function GithubLink(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <Link
      href="https://github.com/aradzie/keybr.com"
      target="github"
      title={formatMessage({
        id: "footer.githubLink.description",
        defaultMessage: "The source code of keybr.com is available on Github.",
      })}
    >
      Github
    </Link>
  );
}

function TranslateLink(): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <Link
      href="https://github.com/aradzie/keybr.com/blob/master/docs/translations.md"
      target="github"
      title={formatMessage({
        id: "footer.translateLink.description",
        defaultMessage: "Help us translate keybr.com into your language.",
      })}
    >
      <FormattedMessage
        id="footer.translateLink.text"
        defaultMessage="Translate"
      />
    </Link>
  );
}

function RemoveAdsLink(): ReactNode {
  const { formatMessage } = useIntl();
  const { publicUser } = usePageData();
  return (
    isPremiumUser(publicUser) || (
      <PageLink link={Sitemap.accountLink(publicUser)}>
        {({ path }) => (
          <Link
            href={path}
            title={formatMessage({
              id: "footer.removeAds.description",
              defaultMessage: "Purchase a premium account to remove ads.",
            })}
          >
            {formatMessage({
              id: "footer.removeAds.label",
              defaultMessage: "Remove Ads",
            })}
          </Link>
        )}
      </PageLink>
    )
  );
}

function LocaleSwitcher({
  currentLink,
}: {
  readonly currentLink: BoundPageLink;
}): ReactNode {
  const { formatLocalLanguageName } = useIntlDisplayNames();
  const children = [];
  for (const locale of allLocales) {
    if (children.length > 0) {
      children.push(" ");
    }
    children.push(
      <Link
        key={locale}
        className={styles.localeLink}
        href={currentLink.formatPath(locale)}
        title={formatLocalLanguageName(locale)}
      >
        {locale}
      </Link>,
    );
  }
  return <span className={styles.localeSwitcher}>{children}</span>;
}
