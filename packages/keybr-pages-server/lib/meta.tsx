import type { FavIconLink } from "@keybr/assets";
import { allLocales } from "@keybr/intl";
import { Pages, usePageData } from "@keybr/pages-shared";
import { type ReactNode } from "react";

export type SiteMeta = {
  readonly facebookAppId: string;
  readonly opengraphType: string;
  readonly opengraphUrl: string;
  readonly opengraphSiteName: string;
  readonly opengraphTitle: string;
  readonly opengraphDescription: string;
  readonly opengraphImage: string;
  readonly twitterCard: string;
  readonly twitterSite: string;
  readonly twitterCreator: string;
};

export type Meta = {
  readonly name?: string;
  readonly property?: string;
  readonly content: string;
};

export const siteMeta = Object.freeze<SiteMeta>({
  facebookAppId: "545353762151265",
  opengraphType: "website",
  opengraphUrl: "https://www.keybr.com/",
  opengraphSiteName: "keybr.com - Typing lessons",
  opengraphTitle: "keybr.com - Typing lessons",
  opengraphDescription:
    "Teaching the world to type at the speed of thought! Typing lessons that work.",
  opengraphImage: "https://www.keybr.com/cover.png",
  twitterCard: "summary",
  twitterSite: "@keybrcom",
  twitterCreator: "@keybrcom",
});

export const metaList = Object.freeze<Meta[]>([
  { property: "fb:app_id", content: siteMeta.facebookAppId },
  { property: "og:type", content: siteMeta.opengraphType },
  { property: "og:url", content: siteMeta.opengraphUrl },
  { property: "og:site_name", content: siteMeta.opengraphSiteName },
  { property: "og:title", content: siteMeta.opengraphTitle },
  { property: "og:description", content: siteMeta.opengraphDescription },
  { property: "og:image", content: siteMeta.opengraphImage },
  { name: "twitter:card", content: siteMeta.twitterCard },
  { name: "twitter:site", content: siteMeta.twitterSite },
  { name: "twitter:creator", content: siteMeta.twitterCreator },
]);

export function MetaList({
  description,
}: {
  readonly description: string;
}): ReactNode {
  return (
    <>
      <meta name="description" content={description} />
      {metaList.map(({ name, property, content }, index) => (
        <meta key={index} name={name} property={property} content={content} />
      ))}
    </>
  );
}

export function AltLangLinks({ path }: { readonly path: string }): ReactNode {
  const { base } = usePageData();
  return allLocales
    .map((locale) => ({
      href: String(new URL(Pages.intlPath(path, locale), base)),
      rel: "alternate",
      hrefLang: locale,
    }))
    .map((link) => <link key={link.href} {...link} />);
}

export const favIcons: readonly FavIconLink[] = [
  {
    href: "/assets/favicon-16x16.png",
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
  },
  {
    href: "/assets/favicon-32x32.png",
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
  },
  {
    href: "/assets/favicon-96x96.png",
    rel: "icon",
    type: "image/png",
    sizes: "96x96",
  },
];
