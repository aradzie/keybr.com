import { Color } from "./color.ts";
import {
  type PropName,
  type PropValue,
  themeProps,
  toCss,
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

  getImage(prop: PropName): Blob | null {
    return (this.#props.get(prop) as Blob) ?? null;
  }

  set(prop: PropName, value: PropValue): CustomTheme {
    const props = new Map(this.#props);
    props.set(prop, value);
    return new CustomTheme(props);
  }

  delete(prop: PropName): CustomTheme {
    const props = new Map(this.#props);
    props.delete(prop);
    return new CustomTheme(props);
  }
}

export function applyTheme(
  theme: CustomTheme,
  style: CSSStyleDeclaration = document.documentElement.style,
) {
  for (const prop of themeProps) {
    const value = theme.get(prop);
    if (value != null) {
      style.setProperty(prop, toCss(prop, value));
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

export const defaultCustomTheme = new CustomTheme()
  .set("--primary-d2", Color.parse("#9a9a9a"))
  .set("--primary-d1", Color.parse("#a6a6a6"))
  .set("--primary", Color.parse("#b3b3b3"))
  .set("--primary-l1", Color.parse("#c0c0c0"))
  .set("--primary-l2", Color.parse("#cccccc"))
  .set("--secondary-d1", Color.parse("#0c0c0c"))
  .set("--secondary", Color.parse("#262626"))
  .set("--secondary-l1", Color.parse("#404040"))
  .set("--secondary-l2", Color.parse("#595959"))
  .set("--secondary-f1", Color.parse("#424242"))
  .set("--secondary-f2", Color.parse("#5e5e5e"))
  .set("--accent-d2", Color.parse("#1a1a1a"))
  .set("--accent-d1", Color.parse("#333333"))
  .set("--accent", Color.parse("#4d4d4d"))
  .set("--accent-l1", Color.parse("#676767"))
  .set("--accent-l2", Color.parse("#808080"))
  .set("--error-d1", Color.parse("#7a351f"))
  .set("--error", Color.parse("#a34729"))
  .set("--error-l1", Color.parse("#cc5933"))
  .set("--slow-key-color", Color.parse("#cc0000"))
  .set("--fast-key-color", Color.parse("#60d788"))
  .set("--pinky-zone-color", Color.parse("#8ec07c"))
  .set("--ring-zone-color", Color.parse("#b8bb26"))
  .set("--middle-zone-color", Color.parse("#fabd2f"))
  .set("--left-index-zone-color", Color.parse("#83a698"))
  .set("--right-index-zone-color", Color.parse("#d3869b"))
  .set("--thumb-zone-color", Color.parse("#d66354"))
  .set("--effort-0-color", Color.parse("#d1daf4"))
  .set("--effort-1-color", Color.parse("#adc5f8"))
  .set("--effort-2-color", Color.parse("#8aaffb"))
  .set("--effort-3-color", Color.parse("#6699ff"));
