import {
  allLocales,
  defaultLocale,
  useIntlDisplayNames,
  usePreferredLocale,
} from "@keybr/intl";
import { isPremiumUser, Pages, usePageData } from "@keybr/pages-shared";
import { Link as StaticLink } from "@keybr/widget";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import * as styles from "./SubMenu.module.less";

export function SubMenu({ currentPath }: { readonly currentPath: string }) {
  const { formatMessage } = useIntl();
  return (
    <div className={styles.root}>
      <MailLink />
      <DiscordLink />
      <GithubLink />
      <RouterLink to={Pages.termsOfService.path}>
        {formatMessage(Pages.termsOfService.link.label)}
      </RouterLink>
      <RouterLink to={Pages.privacyPolicy.path}>
        {formatMessage(Pages.privacyPolicy.link.label)}
      </RouterLink>
      <LocaleSwitcher currentPath={currentPath} />
      <TranslateLink />
      <RemoveAdsLink />
      <StaticLink
        href="https://pianii.com"
        target="pianii"
        title="Piano sheet reading learning"
      >
        pianii.com
      </StaticLink>
    </div>
  );
}

function MailLink() {
  const { formatMessage } = useIntl();
  return (
    <StaticLink
      href="mailto:info@keybr.com"
      target="email"
      title={formatMessage({
        id: "footer.emailLink.description",
        defaultMessage: "Send your comments and suggestions to info@keybr.com",
      })}
    >
      info@keybr.com
    </StaticLink>
  );
}

function DiscordLink() {
  const { formatMessage } = useIntl();
  return (
    <StaticLink
      href="https://discord.gg/gY4RA4enVH"
      target="discord"
      title={formatMessage({
        id: "footer.discordLink.description",
        defaultMessage: "Discuss on our Discord server.",
      })}
    >
      Discord
    </StaticLink>
  );
}

function GithubLink() {
  const { formatMessage } = useIntl();
  return (
    <StaticLink
      href="https://github.com/aradzie/keybr.com"
      target="github"
      title={formatMessage({
        id: "footer.githubLink.description",
        defaultMessage: "The source code of keybr.com is available on Github.",
      })}
    >
      Github
    </StaticLink>
  );
}

function TranslateLink() {
  const { formatMessage } = useIntl();
  return (
    <StaticLink
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
    </StaticLink>
  );
}

function RemoveAdsLink() {
  const { formatMessage } = useIntl();
  const { publicUser } = usePageData();
  return (
    isPremiumUser(publicUser) || (
      <RouterLink
        to={Pages.account.path}
        title={formatMessage({
          id: "footer.removeAds.description",
          defaultMessage: "Purchase a premium account to remove ads.",
        })}
      >
        {formatMessage({
          id: "footer.removeAds.label",
          defaultMessage: "Remove Ads",
        })}
      </RouterLink>
    )
  );
}

function LocaleSwitcher({ currentPath }: { readonly currentPath: string }) {
  const { formatLanguageName, formatLocalLanguageName } = useIntlDisplayNames();
  const preferredLocale = usePreferredLocale();
  const primary = [];
  primary.push(
    <StaticLink
      className={styles.localeLink}
      href={Pages.intlPath(currentPath, preferredLocale)}
    >
      {formatLocalLanguageName(preferredLocale)}
    </StaticLink>,
  );
  if (preferredLocale !== defaultLocale) {
    primary.push(
      <StaticLink
        className={styles.localeLink}
        href={Pages.intlPath(currentPath, defaultLocale)}
      >
        {formatLocalLanguageName(defaultLocale)}
      </StaticLink>,
    );
  }
  const secondary = [];
  for (const locale of allLocales) {
    if (locale !== preferredLocale && locale !== defaultLocale) {
      if (secondary.length > 0) {
        secondary.push(" ");
      }
      secondary.push(
        <StaticLink
          className={styles.localeLink}
          href={Pages.intlPath(currentPath, locale)}
          title={`${formatLocalLanguageName(locale)} / ${formatLanguageName(locale)}`}
        >
          {locale}
        </StaticLink>,
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
