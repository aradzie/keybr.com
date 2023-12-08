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
import { LocaleSwitcher } from "./LocaleSwitcher.tsx";
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
        description: "Email link title.",
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
        description: "Discord link title.",
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
        description: "Github link title.",
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
        description: "Translation link title.",
        defaultMessage: "Help us translate keybr.com into your language.",
      })}
    >
      <FormattedMessage
        id="footer.translateLink.text"
        description="Translation link text."
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
              description: "Link title.",
              defaultMessage: "Purchase a premium account to remove ads.",
            })}
          >
            {formatMessage({
              id: "footer.removeAds.label",
              description: "Link text.",
              defaultMessage: "Remove Ads",
            })}
          </Link>
        )}
      </PageLink>
    )
  );
}
