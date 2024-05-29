import { type CSSProperties } from "react";
import { type Rect } from "../utils/index.ts";

export type FloatingSide =
  | "block-start"
  | "block-end"
  | "inline-start"
  | "inline-end";

export type FloatingPlacement = "end" | "center" | "start";

export type FloatingPosition =
  | "auto"
  | FloatingSide
  | `${FloatingSide}-${FloatingPlacement}`;

export type FloatingWidth = "anchor" | CSSProperties["width"] | null;

export type FloatingHeight = "anchor" | CSSProperties["height"] | null;

export type AlignOptions = {
  readonly position: FloatingPosition;
  readonly flip: boolean;
  readonly shift: boolean;
  readonly offset: number;
  readonly screenMargin: number;
};

export type Anchor = {
  getBoundingBox(position: "absolute" | "fixed"): Rect;
};
