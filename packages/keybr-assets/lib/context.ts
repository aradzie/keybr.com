import { createContext, useContext } from "react";
import { type Manifest } from "./manifest.ts";

export const ManifestContext = createContext<Manifest>(null!);

export function useManifest(): Manifest {
  const value = useContext(ManifestContext);
  if (value == null) {
    throw new Error();
  }
  return value;
}
