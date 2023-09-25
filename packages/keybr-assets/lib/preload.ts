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
    "/assets/mulish-400.latin.woff2",
    "/assets/ubuntu-mono-400.latin.woff2",
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
