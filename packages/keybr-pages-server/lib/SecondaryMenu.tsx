import {
  allLocales,
  defaultLocale,
  useIntlDisplayNames,
  usePreferredLocale,
} from "@keybr/intl";
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
    <div className={styles.root}>
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
      <PageLink
        link={Sitemap.accountLink(publicUser)}
        name={formatMessage({
          id: "footer.removeAds.label",
          defaultMessage: "Remove Ads",
        })}
        title={formatMessage({
          id: "footer.removeAds.description",
          defaultMessage: "Purchase a premium account to remove ads.",
        })}
      />
    )
  );
}

function LocaleSwitcher({
  currentLink,
}: {
  readonly currentLink: BoundPageLink;
}): ReactNode {
  const { formatLanguageName, formatLocalLanguageName } = useIntlDisplayNames();
  const preferredLocale = usePreferredLocale();
  const primary = [];
  primary.push(
    <Link
      className={styles.localeLink}
      href={currentLink.formatPath(preferredLocale)}
    >
      {formatLocalLanguageName(preferredLocale)}
    </Link>,
  );
  if (preferredLocale !== defaultLocale) {
    primary.push(
      <Link
        className={styles.localeLink}
        href={currentLink.formatPath(defaultLocale)}
      >
        {formatLocalLanguageName(defaultLocale)}
      </Link>,
    );
  }
  const secondary = [];
  for (const locale of allLocales) {
    if (locale !== preferredLocale && locale !== defaultLocale) {
      if (secondary.length > 0) {
        secondary.push(" ");
      }
      secondary.push(
        <Link
          className={styles.localeLink}
          href={currentLink.formatPath(locale)}
          title={`${formatLocalLanguageName(locale)} / ${formatLanguageName(locale)}`}
        >
          {locale}
        </Link>,
      );
    }
  }
  return (
    <>
      {...primary}
      <span className={styles.localeList}>{...secondary}</span>
    </>
  );
}
