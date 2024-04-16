import { controller, http } from "@fastr/controller";
import { Context } from "@fastr/core";
import { inject, injectable } from "@fastr/invert";
import { allLocales, defaultLocale } from "@keybr/intl";
import { Sitemap } from "@keybr/pages-shared";
import { js2xml } from "xml-js";

@injectable()
@controller()
export class Controller {
  readonly #body: string;

  constructor(@inject("canonicalUrl") canonicalUrl: string) {
    this.#body = generateSitemapXml(canonicalUrl);
  }

  @http.GET("/sitemap.xml")
  async get(ctx: Context) {
    ctx.response.body = this.#body;
    ctx.response.type = "application/xml";
  }
}

export function generateSitemapXml(canonicalUrl: string): any {
  const makeUrl = (path: string): string => {
    return String(new URL(path, canonicalUrl));
  };
  const sortedLocales = [...new Set([defaultLocale, ...allLocales])];
  const url: unknown[] = [];
  for (const link of Sitemap.sitemapLinks) {
    for (const locale of sortedLocales) {
      const alternate: any[] = [];
      for (const alternateLocale of sortedLocales) {
        alternate.push({
          _attributes: {
            rel: "alternate",
            hreflang: alternateLocale,
            href: makeUrl(link.bind(null).formatPath(alternateLocale)),
          },
        });
      }
      url.push({
        "loc": { _text: makeUrl(link.bind(null).formatPath(locale)) },
        "xhtml:link": alternate,
      });
    }
  }
  return js2xml(
    {
      _declaration: {
        _attributes: {
          version: "1.0",
          encoding: "utf-8",
        },
      },
      urlset: {
        _attributes: {
          "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
          "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
        },
        url,
      },
    },
    {
      compact: true,
      spaces: 2,
    },
  );
}
