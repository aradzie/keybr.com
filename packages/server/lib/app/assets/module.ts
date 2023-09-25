import { join } from "node:path";
import { type Binder, inject, type Module, provides } from "@fastr/invert";
import { loadManifestSync, Manifest } from "@keybr/assets";

export class ManifestModule implements Module {
  configure(binder: Binder): void {}

  @provides({ singleton: true })
  provideManifest(@inject("publicDir") publicDir: string): Manifest {
    return loadManifestSync(join(publicDir, "assets", "manifest.json"));
  }
}
