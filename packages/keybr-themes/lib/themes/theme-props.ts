import { Color, parseColor } from "@keybr/color";
import { Asset } from "./asset.ts";

export type GenericType<T extends PropValue> = {
  readonly toCss: (value: PropValue) => string;
  readonly format: (value: PropValue) => Promise<string>;
  readonly parse: (value: string) => Promise<PropValue>;
};

export type ColorType = { readonly type: "color" } & GenericType<Color>;
export type ImageType = { readonly type: "image" } & GenericType<Asset>;
export type ShadowType = { readonly type: "shadow" } & GenericType<string>;
export type BackdropType = { readonly type: "backdrop" } & GenericType<string>;
export type FontType = { readonly type: "font" } & GenericType<string>;

export type PropsMap = typeof themePropsMap;

export type PropName = keyof PropsMap;

export type PropValue = Color | Asset | string;

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
    return String(value.toRgb());
  },
  parse: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return parseColor(value);
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

export const shadowType = {
  type: "shadow",
  toCss: (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
  format: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
  parse: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
} satisfies ShadowType;

export const backdropType = {
  type: "backdrop",
  toCss: (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
  format: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
  parse: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
} satisfies BackdropType;

export const fontType = {
  type: "font",
  toCss: (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
  format: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
  parse: async (value) => {
    if (typeof value !== "string") {
      throw new TypeError();
    }
    return value;
  },
} satisfies FontType;

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
  "--Name-color": colorType,
  "--Value-color": colorType,
  "--Value--more__color": colorType,
  "--Value--less__color": colorType,
  "--Chart-speed__color": colorType,
  "--Chart-accuracy__color": colorType,
  "--Chart-complexity__color": colorType,
  "--Chart-threshold__color": colorType,
  "--Chart-hist-h__color": colorType,
  "--Chart-hist-m__color": colorType,
  "--Chart-hist-r__color": colorType,
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
