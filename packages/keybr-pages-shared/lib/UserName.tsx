import { clsx } from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Avatar } from "./Avatar.tsx";
import { type BoundPageLink, PageLink } from "./pagelink.tsx";
import { type AnyUser } from "./types.ts";
import * as styles from "./UserName.module.less";

export function UserName({
  user,
  link,
}: {
  readonly user: AnyUser;
  readonly link?: BoundPageLink<any> | null;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { id, name } = user;
  return (
    <span
      className={styles.root}
      title={
        id != null
          ? name
          : formatMessage({
              id: "account.anonymousUserName",
              defaultMessage: "Anonymous User",
            })
      }
    >
      <Avatar user={user} size="medium" className={styles.avatar} />
      {link != null ? (
        <PageLink
          link={link}
          className={clsx(styles.name, id == null && styles.anonymous)}
        >
          {() => name}
        </PageLink>
      ) : (
        <span className={clsx(styles.name, id == null && styles.anonymous)}>
          {name}
        </span>
      )}
    </span>
  );
}
