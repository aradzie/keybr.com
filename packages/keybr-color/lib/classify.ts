import { isNumber, isObjectLike } from "@keybr/lang";
import {
  type Hsl,
  type Hsv,
  type Hwb,
  type Oklab,
  type Oklch,
  type Xyz,
} from "./types.ts";

export const isHsl = (o: any): o is Hsl => {
  return (
    isObjectLike(o) &&
    isNumber(o.h) &&
    isNumber(o.s) &&
    isNumber(o.l) &&
    isNumber(o.alpha)
  );
};

export const isHsv = (o: any): o is Hsv => {
  return (
    isObjectLike(o) &&
    isNumber(o.h) &&
    isNumber(o.s) &&
    isNumber(o.v) &&
    isNumber(o.alpha)
  );
};

export const isHwb = (o: any): o is Hwb => {
  return (
    isObjectLike(o) &&
    isNumber(o.h) &&
    isNumber(o.w) &&
    isNumber(o.b) &&
    isNumber(o.alpha)
  );
};

export const isOklab = (o: any): o is Oklab => {
  return (
    isObjectLike(o) &&
    isNumber(o.l) &&
    isNumber(o.a) &&
    isNumber(o.b) &&
    isNumber(o.alpha)
  );
};

export const isOklch = (o: any): o is Oklch => {
  return (
    isObjectLike(o) &&
    isNumber(o.l) &&
    isNumber(o.c) &&
    isNumber(o.h) &&
    isNumber(o.alpha)
  );
};

export const isXyz = (o: any): o is Xyz => {
  return (
    isObjectLike(o) &&
    isNumber(o.x) &&
    isNumber(o.y) &&
    isNumber(o.z) &&
    isNumber(o.alpha)
  );
};
