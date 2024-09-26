import { injectable } from "@fastr/invert";
import { Manifest, ManifestContext, type PreloadLink } from "@keybr/assets";
import { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const preloadLinks: readonly PreloadLink[] = [
  // Preload stylesheets.
  ...["/assets/styles.css"].map(
    (href) =>
      ({
        href,
        rel: "preload",
        as: "style",
      }) as PreloadLink,
  ),
  // Preload fonts.
  ...[
    "/assets/open-sans-400.latin.woff2",
    "/assets/open-sans-400italic.latin.woff2",
    "/assets/open-sans-700.latin.woff2",
    "/assets/open-sans-700italic.latin.woff2",
  ].map(
    (href) =>
      ({
        href,
        rel: "preload",
        as: "font",
        crossOrigin: "anonymous",
      }) as PreloadLink,
  ),
];

@injectable()
export class View {
  constructor(readonly manifest: Manifest) {}

  preloadHeaders(): string[] {
    return preloadLinks.map((link) => this.preloadHeader(link));
  }

  preloadHeader(link: PreloadLink): string {
    const fields = [`<${this.manifest.assetPath(link.href)}>`];
    const names = ["rel", "as", "type", "crossOrigin", "integrity"] as const;
    for (const name of names) {
      const value = link[name];
      if (value != null) {
        switch (name) {
          case "rel":
            fields.push(`rel=${value}`);
            break;
          case "as":
            fields.push(`as=${value}`);
            break;
          case "type":
            fields.push(`type=${value}`);
            break;
          case "crossOrigin":
            fields.push(`crossorigin=${value}`);
            break;
          case "integrity":
            fields.push(`integrity=${value}`);
            break;
        }
      }
    }
    return fields.join(";");
  }

  renderPage(element: ReactNode): string {
    return (
      "<!DOCTYPE html>" +
      renderToStaticMarkup(
        <ManifestContext.Provider value={this.manifest}>
          {element}
        </ManifestContext.Provider>,
      )
    );
  }
}
