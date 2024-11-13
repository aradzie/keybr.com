import { type LayoutBuilder } from "./layoutbuilder.ts";

export async function exportLayout(layout: LayoutBuilder): Promise<Blob> {
  const json = JSON.stringify(layout.toJSON(), null, 2);
  return new Blob([json], { type: "application/json" });
}
