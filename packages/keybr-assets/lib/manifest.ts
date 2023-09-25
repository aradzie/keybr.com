import { type Entrypoint } from "./types.ts";

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
}
