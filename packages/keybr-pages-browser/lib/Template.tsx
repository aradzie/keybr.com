import { isPremiumUser, usePageData } from "@keybr/pages-shared";
import { AdBanner } from "@keybr/thirdparties";
import { type ReactNode } from "react";
import { NavMenu } from "./NavMenu.tsx";
import * as styles from "./Template.module.less";

export function Template({
  path,
  children,
}: {
  readonly path: string;
  readonly children: ReactNode;
}): ReactNode {
  const { publicUser } = usePageData();
  return isPremiumUser(publicUser) ? (
    <div className={styles.bodyAlt}>
      <main className={styles.mainAlt}>{children}</main>
      <nav className={styles.navAlt}>
        <NavMenu currentPath={path} />
      </nav>
      <EnvName />
    </div>
  ) : (
    <div className={styles.body}>
      <main className={styles.main}>{children}</main>
      <nav className={styles.nav}>
        <NavMenu currentPath={path} />
      </nav>
      <div className={styles.topbar}>
        <AdBanner name="BANNER_970X90_1" />
      </div>
      <div className={styles.sidebar}>
        <AdBanner name="BANNER_160X600_1" />
      </div>
      <EnvName />
    </div>
  );
}

function EnvName(): ReactNode {
  return process.env.NODE_ENV === "production" ? null : (
    <div
      style={{
        position: "fixed",
        zIndex: "1",
        insetInlineEnd: "0px",
        insetBlockEnd: "0px",
        padding: "5px",
        margin: "5px",
        border: "1px solid red",
        color: "red",
      }}
    >
      {`process.env.NODE_ENV=${process.env.NODE_ENV}`}
    </div>
  );
}
