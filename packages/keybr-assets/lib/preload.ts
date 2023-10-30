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
    "/assets/opensans-400-normal.latin.woff2",
    "/assets/opensans-400-italic.latin.woff2",
    "/assets/opensans-700-normal.latin.woff2",
    "/assets/opensans-700-italic.latin.woff2",
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
