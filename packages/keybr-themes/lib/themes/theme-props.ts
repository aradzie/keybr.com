import { Color } from "@keybr/color";
import { Asset } from "./asset.ts";

export type GenericType<T extends PropValue> = {
  readonly toCss: (value: PropValue) => string;
  readonly format: (value: PropValue) => Promise<string>;
  readonly parse: (value: string) => Promise<PropValue>;
};

export type ColorType = { readonly type: "color" } & GenericType<Color>;

export type ImageType = { readonly type: "image" } & GenericType<Asset>;

export type PropsMap = typeof themePropsMap;

export type PropName = keyof PropsMap;

export type PropValue = Color | Asset;

export const colorType = {
  type: "color",
  toCss: (value) => {
    if (!(value instanceof Color)) {
      throw new TypeError();
    }
    return String(value);
  },
  format: async (value) => {
    if (!(value instanceof Color)) {
      throw new TypeError();
    }
    return String(value);
  },
  parse: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return Color.parse(value);
  },
} satisfies ColorType;

export const imageType = {
  type: "image",
  toCss: (value) => {
    if (!(value instanceof Asset)) {
      throw new TypeError();
    }
    return `url(${value.url})`;
  },
  format: async (value) => {
    if (!(value instanceof Asset)) {
      throw new TypeError();
    }
    return value.format();
  },
  parse: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return await Asset.parse(value);
  },
} satisfies ImageType;

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
  "--textinput__color": colorType,
  "--textinput--special__color": colorType,
  "--textinput--hit__color": colorType,
  "--textinput--miss__color": colorType,
  "--slow-key-color": colorType,
  "--fast-key-color": colorType,
  "--effort-color": colorType,
  "--pinky-zone-color": colorType,
  "--ring-zone-color": colorType,
  "--middle-zone-color": colorType,
  "--left-index-zone-color": colorType,
  "--right-index-zone-color": colorType,
  "--thumb-zone-color": colorType,
  "--syntax-keyword": colorType,
  "--syntax-string": colorType,
  "--syntax-number": colorType,
  "--syntax-comment": colorType,
} as const;

export const themeProps = Object.keys(themePropsMap) as (keyof PropsMap)[];
