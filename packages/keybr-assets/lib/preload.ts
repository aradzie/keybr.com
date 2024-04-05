import { type PreloadLink } from "./types.ts";

export const preloadLinks: readonly PreloadLink[] = [
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
