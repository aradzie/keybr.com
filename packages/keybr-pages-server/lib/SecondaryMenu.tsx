import { type BoundPageLink, PageLink, Sitemap } from "@keybr/pages-shared";
import { Link } from "@keybr/widget";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { LocaleSwitcher } from "./LocaleSwitcher.tsx";
import * as styles from "./SecondaryMenu.module.less";

export function SecondaryMenu({
  currentLink,
}: {
  readonly currentLink: BoundPageLink;
}): ReactNode {
  const { formatMessage } = useIntl();

  return (
    <div className={styles.secondaryMenu}>
      <Link
        href="mailto:info@keybr.com"
        target="email"
        title={formatMessage({
          id: "footer.emailLink.description",
          description: "Email link title.",
          defaultMessage:
            "Send your comments and suggestions to info@keybr.com",
        })}
      >
        info@keybr.com
      </Link>
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
      <Link
        href="https://github.com/aradzie/keybr.com"
        target="github"
        title={formatMessage({
          id: "footer.githubLink.description",
          description: "Github link title.",
          defaultMessage:
            "The source code of keybr.com is available on Github.",
        })}
      >
        Github
      </Link>
      <PageLink link={Sitemap.termsOfService.bind(null)} />
      <PageLink link={Sitemap.privacyPolicy.bind(null)} />
      <LocaleSwitcher currentLink={currentLink} />
    </div>
  );
}
