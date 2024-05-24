import { ThemeSwitcher } from "@keybr/lnf";
import {
  AlertIcon,
  type AnyUser,
  Avatar,
  type BoundPageLink,
  PageLink,
  Sitemap,
  usePageData,
} from "@keybr/pages-shared";
import { type ReactNode } from "react";
import * as styles from "./NavMenu.module.less";
import { SecondaryMenu } from "./SecondaryMenu.tsx";

export function NavMenu({
  currentLink,
}: {
  readonly currentLink: BoundPageLink;
}): ReactNode {
  const { publicUser } = usePageData();

  return (
    <div className={styles.root}>
      <MenuItem>
        <AccountLink user={publicUser} />
      </MenuItem>

      <MenuItem>
        <ThemeSwitcher />
      </MenuItem>

      {Sitemap.menuItems.map((link, index) => (
        <MenuItem key={index}>
          <MenuItemLink link={link.bind(null)} />
        </MenuItem>
      ))}

      <MenuItem>
        <SecondaryMenu currentLink={currentLink} />
      </MenuItem>
    </div>
  );
}

function MenuItem({ children }: { readonly children: ReactNode }): ReactNode {
  return <div className={styles.item}>{children}</div>;
}

function AccountLink({ user }: { readonly user: AnyUser }): ReactNode {
  return (
    <PageLink className={styles.accountLink} link={Sitemap.accountLink(user)}>
      {({ name }) => (
        <>
          <Avatar user={user.id != null ? user : null} size="large" />
          <span className={styles.accountLinkName}>{name}</span>
        </>
      )}
    </PageLink>
  );
}

function MenuItemLink({
  link,
}: {
  readonly link: BoundPageLink<any>;
}): ReactNode {
  return (
    <PageLink link={link} className={styles.link}>
      {({ name, icon: Icon = AlertIcon }) => (
        <>
          <Icon className={styles.icon} />
          <span className={styles.label}>{name}</span>
        </>
      )}
    </PageLink>
  );
}
