import "./buildinfo.ts";

export * from "./init.tsx";
export * from "./Slot.tsx";

export function bundleStyles(styles: any): void {
  // Forces inclusion of styles that used by the components
  // rendered only on the server.
}
