import { isPlainObject } from "@keybr/lang";
import { Manifest } from "./manifest.ts";
import { type Entrypoint, type Script, type StylesheetLink } from "./types.ts";

export type ManifestJson = {
  readonly entrypoints: EntrypointsJson;
  readonly assets: AssetsJson;
};

export type EntrypointsJson = Record<string, RawEntrypointJson>;

export type RawEntrypointJson = {
  readonly assets: AssetGroupsJson;
  readonly preload?: AssetGroupsJson;
  readonly prefetch?: AssetGroupsJson;
};

export type AssetGroupsJson = {
  readonly js?: readonly string[];
  readonly css?: readonly string[];
};

export type AssetsJson = Record<string, string>;

export function manifestFromJson(json: ManifestJson): Manifest {
  if (
    !isPlainObject(json) ||
    !isPlainObject(json.entrypoints) ||
    !isPlainObject(json.assets)
  ) {
    throw new TypeError();
  }

  const entrypoints = new Map(
    Object.entries(json.entrypoints).map(([name, value]) => [
      name,
      makeEntrypoint(value),
    ]),
  );

  const assets = new Map(Object.entries(json.assets));

  return new (class extends Manifest {
    entrypoint(name: string): Entrypoint {
      const entrypoint = entrypoints.get(name);
      if (entrypoint == null) {
        throw new Error(`Unknown entrypoint "${name}"`);
      } else {
        return entrypoint;
      }
    }

    assetPath(name: string): string {
      const path = assets.get(name);
      if (path == null) {
        throw new Error(`Unknown asset "${name}"`);
      } else {
        return path;
      }
    }
  })();
}

function makeEntrypoint({
  assets: { js = [], css = [] },
}: RawEntrypointJson): Entrypoint {
  return {
    scripts: js.map(makeEntrypointScript),
    stylesheets: css.map(makeEntrypointStylesheet),
    preload: [],
    prefetch: [],
  };
}

function makeEntrypointScript(path: string): Script {
  return {
    src: path,
    defer: true,
  };
}

function makeEntrypointStylesheet(path: string): StylesheetLink {
  return {
    href: path,
    rel: "stylesheet",
  };
}
