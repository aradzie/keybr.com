import { type Color } from "@keybr/color";
import { hashCode } from "@keybr/rand";
import { type Asset } from "./asset.ts";
import {
  type PropName,
  type PropValue,
  themeProps,
  themePropsMap,
} from "./theme-props.ts";

export class CustomTheme implements Iterable<[PropName, PropValue]> {
  readonly #props: Map<PropName, PropValue>;

  constructor(props: Iterable<[PropName, PropValue]> = []) {
    this.#props = new Map(props);
  }

  *[Symbol.iterator](): IterableIterator<[PropName, PropValue]> {
    for (const prop of themeProps) {
      const value = this.#props.get(prop);
      if (value != null) {
        yield [prop, value];
      }
    }
  }

  get(prop: PropName): PropValue | null {
    return this.#props.get(prop) ?? null;
  }

  getColor(prop: PropName): Color | null {
    return (this.#props.get(prop) as Color) ?? null;
  }

  getImage(prop: PropName): Asset | null {
    return (this.#props.get(prop) as Asset) ?? null;
  }

  set(prop: PropName, value: PropValue | null): CustomTheme {
    const props = new Map(this.#props);
    if (value == null) {
      props.delete(prop);
    } else {
      props.set(prop, value);
    }
    return new CustomTheme(props);
  }

  delete(prop: PropName): CustomTheme {
    const props = new Map(this.#props);
    props.delete(prop);
    return new CustomTheme(props);
  }

  merge(that: CustomTheme): CustomTheme {
    const props = new Map(this.#props);
    for (const [prop, value] of that) {
      props.set(prop, value);
    }
    return new CustomTheme(props);
  }

  #hash: number | null = null;

  hash(): number {
    if (this.#hash == null) {
      let hash = 1;
      for (const [prop, value] of this) {
        const type = themePropsMap[prop];
        hash = (hash * 31 + hashCode(type.toCss(value))) >>> 0;
      }
      this.#hash = hash;
    }
    return this.#hash;
  }
}

export function applyTheme(
  theme: CustomTheme,
  style: CSSStyleDeclaration = document.documentElement.style,
) {
  for (const prop of themeProps) {
    const type = themePropsMap[prop];
    const value = theme.get(prop);
    if (value != null) {
      style.setProperty(prop, type.toCss(value));
    } else {
      style.removeProperty(prop);
    }
  }
}

export function clearTheme(
  style: CSSStyleDeclaration = document.documentElement.style,
) {
  for (const prop of themeProps) {
    style.removeProperty(prop);
  }
}
