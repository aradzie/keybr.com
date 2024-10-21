import { type ReactNode } from "react";
import { useManifest } from "./context.ts";
import { type FavIconLink, type PreloadLink } from "./types.ts";

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

export function FavIconAssets({
  links,
}: {
  readonly links: readonly FavIconLink[];
}): ReactNode {
  const manifest = useManifest();
  return links
    .map(({ href, ...rest }) => ({
      href: manifest.assetPath(href),
      ...rest,
    }))
    .map((link) => <link key={link.href} {...link} />);
}

export function PreloadAssets({
  links,
}: {
  readonly links: readonly PreloadLink[];
}) {
  const manifest = useManifest();
  return links
    .map(({ href, ...rest }) => ({
      href: manifest.assetPath(href),
      ...rest,
    }))
    .map((link) => <link key={link.href} {...link} />);
}
