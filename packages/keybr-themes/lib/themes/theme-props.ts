import { getBlobUrl } from "./blob-cache.ts";
import { Color } from "./color.ts";

export type ColorType = { readonly type: "color" };

export type ImageType = { readonly type: "image" };

export type PropsMap = typeof themePropsMap;

export type PropName = keyof PropsMap;

export type PropValue = Color | Blob;

export const colorType = { type: "color" } as ColorType;

export const imageType = { type: "image" } as ImageType;

export const themePropsMap = {
  "--primary-d2": colorType,
  "--primary-d1": colorType,
  "--primary": colorType,
  "--primary-l1": colorType,
  "--primary-l2": colorType,
  "--secondary-d1": colorType,
  "--secondary": colorType,
  "--secondary-l1": colorType,
  "--secondary-l2": colorType,
  "--secondary-f1": colorType,
  "--secondary-f2": colorType,
  "--accent-d2": colorType,
  "--accent-d1": colorType,
  "--accent": colorType,
  "--accent-l1": colorType,
  "--accent-l2": colorType,
  "--error-d1": colorType,
  "--error": colorType,
  "--error-l1": colorType,
  "--background-image": imageType,
  "--slow-key-color": colorType,
  "--fast-key-color": colorType,
  "--pinky-zone-color": colorType,
  "--ring-zone-color": colorType,
  "--middle-zone-color": colorType,
  "--left-index-zone-color": colorType,
  "--right-index-zone-color": colorType,
  "--thumb-zone-color": colorType,
  "--effort-0-color": colorType,
  "--effort-1-color": colorType,
  "--effort-2-color": colorType,
  "--effort-3-color": colorType,
} as const;

export const themeProps = Object.keys(themePropsMap) as (keyof PropsMap)[];

export const toCss = (name: PropName, value: PropValue): string => {
  switch (themePropsMap[name].type) {
    case "color":
      if (!(value instanceof Color)) {
        throw new TypeError();
      }
      return String(value);
    case "image":
      if (!(value instanceof Blob)) {
        throw new TypeError();
      }
      return `url(${getBlobUrl(value)})`;
  }
};
