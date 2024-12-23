import { type CSSProperties, type RefObject } from "react";
import { type Size } from "../../utils/size.ts";
import { type ClassName, type MouseProps, type WheelProps } from "../types.ts";
import { type ShapeList } from "./graphics.ts";

export type PaintCallback = (size: Size) => ShapeList;

export type CanvasProps = {
  readonly className?: ClassName;
  readonly id?: string;
  readonly paint: PaintCallback;
  readonly ref?: RefObject<CanvasRef | null>;
  readonly style?: CSSProperties;
  readonly title?: string;
  readonly onResize?: (size: Size) => void;
} & MouseProps &
  WheelProps;

export type CanvasRef = {
  readonly getSize: () => Size | null;
  readonly getContext: typeof HTMLCanvasElement.prototype.getContext;
  readonly toBlob: typeof HTMLCanvasElement.prototype.toBlob;
  readonly toDataURL: typeof HTMLCanvasElement.prototype.toDataURL;
  readonly paint: (callback: PaintCallback) => void;
};
