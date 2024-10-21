import { type Entrypoint, type PreloadLink } from "./types.ts";

export abstract class Manifest {
  static fake = new (class extends Manifest {
    entrypoint(name: string): Entrypoint {
      return {
        scripts: [{ src: `/assets/${name}.js`, defer: true }],
        stylesheets: [{ href: `/assets/${name}.css`, rel: "stylesheet" }],
        preload: [],
        prefetch: [],
      };
    }

    assetPath(name: string): string {
      return name;
    }
  })();

  abstract entrypoint(name: string): Entrypoint;

  abstract assetPath(name: string): string;

  preloadHeader(link: PreloadLink): string {
    const fields = [`<${this.assetPath(link.href)}>`];
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
}
