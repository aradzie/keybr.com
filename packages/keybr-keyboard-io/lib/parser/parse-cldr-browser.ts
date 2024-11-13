import { LayoutBuilder } from "../layoutbuilder.ts";
import { type ParseResult } from "./types.ts";

export function parseCldr(text: string): ParseResult {
  return { layout: new LayoutBuilder(), warnings: [] };
}
