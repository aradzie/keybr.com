import { type ClassName } from "../components/index.ts";
import * as styles from "./size.module.less";

export const styleSizeFit = styles.sizeFit;
export const styleSizeFill = styles.sizeFill;
export const styleSizeFillAlt = styles.sizeFillAlt;
export const styleSizeFull = styles.sizeFull;

export const styleWidth6 = styles.width6;
export const styleWidth10 = styles.width10;
export const styleWidth16 = styles.width16;
export const styleWidth24 = styles.width24;
export const styleWidth32 = styles.width32;

export type SizeName =
  | "default"
  | "fill"
  | "fillAlt"
  | "full"
  | 6
  | 10
  | 16
  | 24
  | 32;

export const sizeClassName = (value?: SizeName | null): ClassName => {
  switch (value) {
    case "fill":
      return styleSizeFill;
    case "fillAlt":
      return styleSizeFillAlt;
    case "full":
      return styleSizeFull;
    case 6:
      return styleWidth6;
    case 10:
      return styleWidth10;
    case 16:
      return styleWidth16;
    case 24:
      return styleWidth24;
    case 32:
      return styleWidth32;
  }
  return null;
};
