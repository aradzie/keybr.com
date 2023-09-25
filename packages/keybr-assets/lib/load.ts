import { readFile, readFileSync } from "@sosimple/fsx";
import { manifestFromJson } from "./json.ts";
import { type Manifest } from "./manifest.ts";

export async function loadManifest(path: string): Promise<Manifest> {
  const content = await readFile(path, "utf-8");
  return manifestFromJson(JSON.parse(content));
}

export function loadManifestSync(path: string): Manifest {
  const content = readFileSync(path, "utf-8");
  return manifestFromJson(JSON.parse(content));
}
