import { type FavIconLink } from "@keybr/assets";
import { allLocales } from "@keybr/intl";
import { type PageInfo, Pages, usePageData } from "@keybr/pages-shared";
import { type ReactNode } from "react";
import { useIntl } from "react-intl";

export function Metas({ page }: { readonly page: PageInfo }): ReactNode {
  const { formatMessage } = useIntl();
  return page.meta.map(({ name, property, content }, index) => {
    if (content != null && typeof content === "object") {
      content = formatMessage(content);
    }
    return (
      <meta key={index} name={name} property={property} content={content} />
    );
  });
}

export function AltLangLinks({ page }: { readonly page: PageInfo }): ReactNode {
  const { base } = usePageData();
  if (
    page.meta.some(
      ({ name, content }) =>
        name === "robots" &&
        typeof content === "string" &&
        content.includes("noindex"),
    )
  ) {
    return null;
  }
  return allLocales
    .map((locale) => ({
      href: String(new URL(Pages.intlPath(page.path, locale), base)),
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
