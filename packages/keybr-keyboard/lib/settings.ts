import {
  booleanProp,
  itemProp,
  type Settings,
  xitemProp,
} from "@keybr/settings";
import { Geometry } from "./geometry.ts";
import { Language } from "./language.ts";
import { Layout } from "./layout.ts";

export const keyboardProps = {
  layout: xitemProp("keyboard.layout", Layout.ALL, Layout.EN_US),
  geometry: itemProp("keyboard.geometry", Geometry.ALL, Geometry.STANDARD_101),
  emulate: booleanProp("keyboard.emulate", true),
  colors: booleanProp("keyboard.colors", true),
} as const;

export class KeyboardOptions {
  static default(): KeyboardOptions {
    return new KeyboardOptions(
      Language.EN,
      Layout.EN_US,
      Geometry.STANDARD_101,
    );
  }

  static from(settings: Settings): KeyboardOptions {
    const layout = settings.get(keyboardProps.layout);
    const geometry = settings.get(keyboardProps.geometry);
    return KeyboardOptions.default()
      .withLanguage(layout.language)
      .withLayout(layout)
      .withGeometry(geometry);
  }

  readonly #language: Language;
  readonly #layout: Layout;
  readonly #geometry: Geometry;

  private constructor(language: Language, layout: Layout, geometry: Geometry) {
    this.#language = language;
    this.#layout = layout;
    this.#geometry = geometry;
  }

  get language(): Language {
    return this.#language;
  }

  get layout(): Layout {
    return this.#layout;
  }

  get geometry(): Geometry {
    return this.#geometry;
  }

  selectableLanguages(): Language[] {
    return [...Language.ALL];
  }

  selectableLayouts(): Layout[] {
    return Layout.ALL.filter(
      (layout) => layout.language.id === this.#language.id,
    );
  }

  selectableGeometries(): Geometry[] {
    return [...this.#layout.geometries];
  }

  withLanguage(language: Language): KeyboardOptions {
    const [layout] = Layout.ALL.filter(
      (layout) => layout.language.id === language.id,
    );
    const [geometry] = layout.geometries;
    return new KeyboardOptions(language, layout, geometry);
  }

  withLayout(layout: Layout): KeyboardOptions {
    if (this.#language === layout.language) {
      const [geometry] = layout.geometries;
      return new KeyboardOptions(this.#language, layout, geometry);
    } else {
      return this;
    }
  }

  withGeometry(geometry: Geometry): KeyboardOptions {
    if (this.#layout.geometries.has(geometry)) {
      return new KeyboardOptions(this.#language, this.#layout, geometry);
    } else {
      return this;
    }
  }

  save(settings: Settings): Settings {
    return settings
      .set(keyboardProps.layout, this.#layout)
      .set(keyboardProps.geometry, this.#geometry);
  }
}
