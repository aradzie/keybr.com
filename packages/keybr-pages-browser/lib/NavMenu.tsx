import { ThemeSwitcher } from "@keybr/lnf";
import { type AnyUser, Avatar, Pages, usePageData } from "@keybr/pages-shared";
import { Icon } from "@keybr/widget";
import { clsx } from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { NavLink } from "react-router-dom";
import * as styles from "./NavMenu.module.less";
import { SubMenu } from "./SubMenu.tsx";

export function NavMenu({
  currentPath,
}: {
  readonly currentPath: string;
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

      <MenuItem>
        <MenuItemLink meta={Pages.practice} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.profile} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.help} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.highScores} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.multiplayer} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.typingTest} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.layouts} />
      </MenuItem>

      <MenuItem>
        <MenuItemLink meta={Pages.wordCount} />
      </MenuItem>

      <MenuItem>
        <SubMenu currentPath={currentPath} />
      </MenuItem>
    </div>
  );
}

function MenuItem({ children }: { readonly children: ReactNode }): ReactNode {
  return <div className={styles.item}>{children}</div>;
}

function AccountLink({ user }: { readonly user: AnyUser }): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(styles.accountLink, isActive && styles.isActive)
      }
      to={Pages.account.path}
      title={
        user.id != null
          ? formatMessage({
              id: "page.account.named.link.description",
              defaultMessage: "Manage your online account.",
            })
          : formatMessage({
              id: "page.account.anonymous.link.description",
              defaultMessage: "Sign-in for an online account.",
            })
      }
    >
      <Avatar user={user.id != null ? user : null} size="large" />
      <span className={styles.userName}>
        {user.id != null
          ? user.name
          : formatMessage({
              id: "page.account.anonymous.link.name",
              defaultMessage: "Sign-In",
            })}
      </span>
    </NavLink>
  );
}

function MenuItemLink({
  meta: {
    path,
    link: { label, title },
    icon,
  },
}: {
  readonly meta: Pages.Meta;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(styles.link, isActive && styles.isActive)
      }
      to={path}
      title={typeof title === "string" ? title : formatMessage(title)}
    >
      <Icon shape={icon} />
      <span className={styles.label}>
        {typeof label === "string" ? label : formatMessage(label)}
      </span>
    </NavLink>
  );
}
