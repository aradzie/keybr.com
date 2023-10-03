import { type EnumItem } from "@keybr/lang";
import isBoolean from "lodash/isBoolean";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";

export type SettingsJson = {
  readonly [key: string]: boolean | number | string | null;
};

export type SettingsValue<T> = {
  readonly key: string;
  readonly defaultValue: T;
  toJson(value: T): boolean | number | string | null;
  fromJson(value: unknown): T;
};

export type Validator<T> = {
  check(value: T, defaultValue: T): T;
};

export function booleanValue(
  key: string,
  defaultValue: boolean,
): SettingsValue<boolean> {
  return {
    key,
    defaultValue,
    toJson(value: boolean): boolean | null {
      if (isBoolean(value)) {
        return value;
      }
      return null;
    },
    fromJson(value: unknown): boolean {
      if (isBoolean(value)) {
        return value;
      }
      return defaultValue;
    },
  };
}

export function numberValue(
  key: string,
  defaultValue: number,
  validator: Validator<number> = noop(),
): SettingsValue<number> {
  return {
    key,
    defaultValue,
    toJson(value: number): number | null {
      if (isNumber(value) && Number.isFinite(value)) {
        return validator.check(value, defaultValue);
      }
      return null;
    },
    fromJson(value: unknown): number {
      if (isNumber(value) && Number.isFinite(value)) {
        return validator.check(value, defaultValue);
      }
      return defaultValue;
    },
  };
}

export function stringValue(
  key: string,
  defaultValue: string,
  validator: Validator<string> = noop(),
): SettingsValue<string> {
  return {
    key,
    defaultValue,
    toJson(value: string): string | null {
      if (isString(value)) {
        return validator.check(value, defaultValue);
      }
      return null;
    },
    fromJson(value: unknown): string {
      if (isString(value)) {
        return validator.check(value, defaultValue);
      }
      return defaultValue;
    },
  };
}

type EnumLike = { readonly [key: number | string]: number | string };

export function enumValue<T extends EnumLike>(
  key: string,
  all: T,
  defaultValue: number,
): SettingsValue<number> {
  return {
    key,
    defaultValue,
    toJson(value: number): string | null {
      if (isNumber(value)) {
        const enumValue = all[value];
        if (isString(enumValue)) {
          return enumValue.toLowerCase();
        }
      }
      return null;
    },
    fromJson(value: unknown): number {
      if (isString(value)) {
        for (const [enumKey, enumValue] of Object.entries(all)) {
          if (
            isNumber(enumValue) &&
            enumKey.toLowerCase() === value.toLowerCase()
          ) {
            return enumValue;
          }
        }
      }
      return defaultValue;
    },
  };
}

export function itemValue<T extends EnumItem>(
  key: string,
  all: Iterable<T>,
  defaultValue: T,
): SettingsValue<T> {
  return {
    key,
    defaultValue,
    toJson(value: T): string | null {
      return value.id;
    },
    fromJson(value: unknown): T {
      for (const item of all) {
        if (item.id === value) {
          return item;
        }
      }
      return defaultValue;
    },
  };
}

export function noop<T>(): Validator<T> {
  return {
    check(value: T, defaultValue: T): T {
      return value;
    },
  };
}

export function clamp(min: number, max: number): Validator<number> {
  return {
    check(value: number, defaultValue: number): number {
      if (value >= min && value <= max) {
        return value;
      }
      return defaultValue;
    },
  };
}

export function minLength(length: number): Validator<string> {
  return {
    check(value: string, defaultValue: string): string {
      if (value.length >= length) {
        return value;
      }
      return defaultValue;
    },
  };
}

export function maxLength(length: number): Validator<string> {
  return {
    check(value: string, defaultValue: string): string {
      if (value.length <= length) {
        return value;
      }
      return defaultValue;
    },
  };
}

export function all<T>(...validators: Validator<T>[]): Validator<T> {
  return {
    check(value: T, defaultValue: T): T {
      for (const validator of validators) {
        value = validator.check(value, defaultValue);
      }
      return value;
    },
  };
}
