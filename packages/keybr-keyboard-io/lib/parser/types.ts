import { type LayoutBuilder } from "../layoutbuilder.ts";

export type ParseResult = {
  layout: LayoutBuilder;
  warnings: string[];
};
