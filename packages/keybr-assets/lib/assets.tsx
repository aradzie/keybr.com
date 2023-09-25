import { type ReactNode } from "react";
import { useManifest } from "./context.ts";
import { type FavIconLink, type Link } from "./types.ts";

export function StylesheetAssets({
  entrypoint,
}: {
  readonly entrypoint: string;
}): ReactNode {
  const manifest = useManifest();
  const { stylesheets } = manifest.entrypoint(entrypoint);
  return stylesheets.map((link) => <link key={link.href} {...link} />);
}

export function ScriptAssets({
  entrypoint,
}: {
  readonly entrypoint: string;
}): ReactNode {
  const manifest = useManifest();
  const { scripts } = manifest.entrypoint(entrypoint);
  return scripts.map((script) => <script key={script.src} {...script} />);
}

const favIconLinks: readonly FavIconLink[] = [
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

export function FavIconAssets(): ReactNode {
  const manifest = useManifest();
  const links = favIconLinks.map(
    ({ href, ...rest }: Link): Link => ({
      href: manifest.assetPath(href),
      ...rest,
    }),
  );
  return links.map((link) => <link key={link.href} {...link} />);
}
