export * from "./fonts/index.ts";
export * from "./themes/index.ts";

export const preload = {
  styles: ["/assets/styles.css"],
  fonts: [
    "/assets/open-sans-400.latin.woff2",
    "/assets/open-sans-400italic.latin.woff2",
  ],
} as const;
