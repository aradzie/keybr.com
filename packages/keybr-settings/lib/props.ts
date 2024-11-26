import {
  type Enum,
  type EnumItem,
  type XEnum,
  type XEnumItem,
} from "@keybr/lang";

export type EnumLike = { readonly [key: string]: number | string };

export type AnyProp<T> = {
  readonly key: string;
  readonly defaultValue: T;
  toJson(value: T): unknown;
  fromJson(value: unknown, defaultValue?: T): T;
};

export type BooleanProp = {
  readonly type: "boolean";
} & AnyProp<boolean>;

export type NumberProp = {
  readonly type: "number";
  readonly min: number;
  readonly max: number;
} & AnyProp<number>;

export type StringProp = {
  readonly type: "string";
  readonly maxLength: number;
} & AnyProp<string>;

export type EnumProp = {
  readonly type: "enum";
  readonly all: EnumLike;
} & AnyProp<number>;

export type ItemProp<T extends EnumItem> = {
  readonly type: "item";
  readonly all: Enum<T>;
} & AnyProp<T>;

export type XItemProp<T extends XEnumItem> = {
  readonly type: "xitem";
  readonly all: XEnum<T>;
} & AnyProp<T>;

export type FlagsProp = {
  readonly type: "flags";
  readonly all: Flags;
} & AnyProp<Flags>;

export type Flags = readonly string[];

export function booleanProp(key: string, defaultValue: boolean): BooleanProp {
  return {
    type: "boolean",
    key,
    defaultValue,
    toJson(value: boolean): unknown {
      return value;
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): boolean {
      return typeof value === "boolean" ? value : defaultValue0;
    },
  };
}

export function numberProp(
  key: string,
  defaultValue: number,
  {
    min = NaN,
    max = NaN,
  }: {
    readonly min?: number;
    readonly max?: number;
  } = {},
): NumberProp {
  return {
    type: "number",
    key,
    defaultValue,
    min,
    max,
    toJson(value: number): unknown {
      return clamp(value, min, max);
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): number {
      return typeof value === "number" ? clamp(value, min, max) : defaultValue0;
    },
  };
}

export function stringProp(
  key: string,
  defaultValue: string,
  {
    maxLength = NaN,
  }: {
    readonly maxLength?: number;
  } = {},
): StringProp {
  return {
    type: "string",
    key,
    defaultValue,
    maxLength,
    toJson(value: string): unknown {
      return trim(value, maxLength);
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): string {
      return typeof value === "string" ? trim(value, maxLength) : defaultValue0;
    },
  };
}

export function enumProp(
  key: string,
  all: EnumLike,
  defaultValue: number,
): EnumProp {
  const map = new Map();
  for (const [from, to] of Object.entries(all)) {
    if (typeof from === "string" && typeof to === "number") {
      map.set(from.toLowerCase(), to);
      map.set(to, from.toLowerCase());
    }
  }
  return {
    type: "enum",
    key,
    defaultValue,
    all,
    toJson(value: number): unknown {
      return map.get(value);
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): number {
      return typeof value === "string"
        ? (map.get(value) ?? defaultValue0)
        : defaultValue0;
    },
  };
}

export function itemProp<T extends EnumItem>(
  key: string,
  all: Enum<T>,
  defaultValue: T,
): ItemProp<T> {
  return {
    type: "item",
    key,
    defaultValue,
    all,
    toJson(value: T): unknown {
      return value.id;
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): T {
      return typeof value === "string"
        ? all.get(value, defaultValue0)
        : defaultValue0;
    },
  };
}

export function xitemProp<T extends XEnumItem>(
  key: string,
  all: XEnum<T>,
  defaultValue: T,
): XItemProp<T> {
  return {
    type: "xitem",
    key,
    defaultValue,
    all,
    toJson(value: T): unknown {
      return value.id;
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): T {
      return typeof value === "string"
        ? all.get(value, defaultValue0)
        : defaultValue0;
    },
  };
}

export function flagsProp(
  key: string,
  all: Flags,
  defaultValue: Flags = all,
): FlagsProp {
  return {
    type: "flags",
    key,
    defaultValue: all,
    all,
    toJson(value: Flags): unknown {
      return value.filter((v) => all.includes(v)).join(",");
    },
    fromJson(value: unknown, defaultValue0 = defaultValue): Flags {
      return typeof value === "string"
        ? value.split(",").filter((v) => all.includes(v))
        : defaultValue0;
    },
  };
}

function clamp(value: number, min: number, max: number): number {
  if (min === min) {
    value = Math.max(min, value);
  }
  if (max === max) {
    value = Math.min(max, value);
  }
  return value;
}

function trim(value: string, maxLength: number): string {
  if (maxLength === maxLength) {
    value = value.substring(0, maxLength);
  }
  return value;
}
