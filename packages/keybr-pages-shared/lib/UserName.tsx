import { clsx } from "clsx";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router";
import { Avatar } from "./Avatar.tsx";
import { type AnyUser } from "./types.ts";
import * as styles from "./UserName.module.less";

export function UserName({
  user,
  path,
}: {
  readonly user: AnyUser;
  readonly path?: string | null;
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
      {path != null ? (
        <Link
          to={path}
          className={clsx(styles.name, id == null && styles.anonymous)}
        >
          {name}
        </Link>
      ) : (
        <span className={clsx(styles.name, id == null && styles.anonymous)}>
          {name}
        </span>
      )}
    </span>
  );
}
