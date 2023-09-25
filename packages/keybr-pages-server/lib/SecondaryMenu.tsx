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
          id: "footer.emailLinkTitle",
          description: "Footer email link title.",
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
          id: "footer.discordLinkTitle",
          description: "Footer Discord link title.",
          defaultMessage: "Discuss on our Discord server.",
        })}
      >
        Discord
      </Link>
      <PageLink link={Sitemap.termsOfService.bind(null)} />
      <PageLink link={Sitemap.privacyPolicy.bind(null)} />
      <LocaleSwitcher currentLink={currentLink} />
    </div>
  );
}
