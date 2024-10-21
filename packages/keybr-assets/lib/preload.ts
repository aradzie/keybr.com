import { type PreloadLink } from "./types.ts";

export function preloadStyle(href: string): PreloadLink {
  return { href, rel: "preload", as: "style" };
}

export function preloadFont(href: string): PreloadLink {
  return { href, rel: "preload", as: "font", crossOrigin: "anonymous" };
}
