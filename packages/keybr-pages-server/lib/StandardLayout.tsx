import { FavIconAssets, ScriptAssets, StylesheetAssets } from "@keybr/assets";
import { getDir } from "@keybr/intl";
import { ThemePrefs, useTheme } from "@keybr/lnf";
import {
  AltLangLinks,
  isPremiumUser,
  PageDataScript,
  usePageData,
} from "@keybr/pages-shared";
import {
  AdBanner,
  CloudflareAnalytics,
  GoogleTagManager,
  SetupAds,
} from "@keybr/thirdparties";
import { PortalContainer } from "@keybr/widget";
import { type ReactNode } from "react";
import { MetaList } from "./meta.tsx";
import { NavMenu } from "./NavMenu.tsx";
import * as styles from "./StandardLayout.module.less";
import { type PageMeta } from "./types.ts";

export function StandardLayout({
  pageMeta,
  children,
}: {
  readonly pageMeta: PageMeta;
  readonly children: ReactNode;
}): ReactNode {
  const { publicUser } = usePageData();
  const premium = isPremiumUser(publicUser);

  return (
    <Html>
      <Head pageMeta={pageMeta}>
        {premium || (
          <>
            <CloudflareAnalytics />
            <GoogleTagManager />
            <SetupAds>
              <ScriptAssets entrypoint="ads" />
            </SetupAds>
          </>
        )}
      </Head>
      {premium ? (
        <BodyAlt pageMeta={pageMeta}>{children}</BodyAlt>
      ) : (
        <Body pageMeta={pageMeta}>{children}</Body>
      )}
    </Html>
  );
}

function Html({ children }: { readonly children?: ReactNode }): ReactNode {
  const theme = useTheme();
  const { locale } = usePageData();

  return (
    <html
      lang={locale}
      dir={getDir(locale)}
      prefix="og: http://ogp.me/ns#"
      {...ThemePrefs.dataAttributes(theme)}
    >
      {children}
    </html>
  );
}

function Head({
  pageMeta: { pageLink, title, description, entrypoint },
  children,
}: {
  readonly pageMeta: PageMeta;
  readonly children?: ReactNode;
}): ReactNode {
  return (
    <head>
      <meta charSet="UTF-8" />
      <title>{title}</title>
      <StylesheetAssets entrypoint={entrypoint} />
      <FavIconAssets />
      <AltLangLinks pageLink={pageLink} />
      <MetaList description={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <PageDataScript />
      <ScriptAssets entrypoint={entrypoint} />
      {children}
    </head>
  );
}

function Body({
  pageMeta,
  children,
}: {
  readonly pageMeta: PageMeta;
  readonly children?: ReactNode;
}): ReactNode {
  return (
    <body className={styles.body}>
      <main className={styles.app}>{children}</main>
      <nav className={styles.nav}>
        <NavMenu currentLink={pageMeta.pageLink} />
      </nav>
      <div className={styles.topbar}>
        <AdBanner name="BANNER_970X90_1" />
      </div>
      <div className={styles.sidebar}>
        <AdBanner name="BANNER_160X600_1" />
      </div>
      <PortalContainer />
      <EnvName />
    </body>
  );
}

function BodyAlt({
  pageMeta,
  children,
}: {
  readonly pageMeta: PageMeta;
  readonly children?: ReactNode;
}): ReactNode {
  return (
    <body className={styles.bodyAlt}>
      <main className={styles.appAlt}>{children}</main>
      <nav className={styles.navAlt}>
        <NavMenu currentLink={pageMeta.pageLink} />
      </nav>
      <PortalContainer />
      <EnvName />
    </body>
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
