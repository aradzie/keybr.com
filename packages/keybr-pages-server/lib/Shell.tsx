import { FavIconAssets, ScriptAssets, StylesheetAssets } from "@keybr/assets";
import { getDir } from "@keybr/intl";
import { ThemePrefs, useTheme } from "@keybr/lnf";
import {
  isPremiumUser,
  PageDataScript,
  type Pages,
  Root,
  usePageData,
} from "@keybr/pages-shared";
import {
  CloudflareAnalytics,
  GoogleTagManager,
  SetupAds,
} from "@keybr/thirdparties";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";
import { AltLangLinks, favIcons, MetaList } from "./meta.tsx";

export function Shell({
  meta,
  children,
}: {
  readonly meta: Pages.Meta;
  readonly children?: ReactNode;
}): ReactNode {
  const { publicUser } = usePageData();
  return (
    <Html>
      <Head meta={meta}>
        {isPremiumUser(publicUser) || (
          <>
            <CloudflareAnalytics />
            <GoogleTagManager />
            <SetupAds>
              <ScriptAssets entrypoint="ads" />
            </SetupAds>
          </>
        )}
      </Head>
      <Body>{children}</Body>
    </Html>
  );
}

function Html({ children }: { readonly children?: ReactNode }): ReactNode {
  const { locale } = usePageData();
  const theme = useTheme();
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
  meta: {
    path,
    meta: { title, description },
  },
  children,
}: {
  readonly meta: Pages.Meta;
  readonly children?: ReactNode;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <head>
      <meta charSet="UTF-8" />
      <title>{typeof title === "string" ? title : formatMessage(title)}</title>
      <StylesheetAssets entrypoint="browser" />
      <FavIconAssets links={favIcons} />
      <AltLangLinks path={path} />
      <MetaList
        description={
          typeof description === "string"
            ? description
            : formatMessage(description)
        }
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <PageDataScript />
      <ScriptAssets entrypoint="browser" />
      {children}
    </head>
  );
}

function Body({ children }: { readonly children?: ReactNode }): ReactNode {
  return (
    <body>
      <Root>{children}</Root>
    </body>
  );
}
