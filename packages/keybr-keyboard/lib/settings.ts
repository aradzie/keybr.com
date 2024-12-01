import {
  booleanProp,
  enumProp,
  itemProp,
  type Settings,
  xitemProp,
} from "@keybr/settings";
import { Geometry, ZoneMod } from "./geometry.ts";
import { Language } from "./language.ts";
import { Layout } from "./layout.ts";
import { nullMod } from "./mod.ts";

export enum Emulation {
  /**
   * No emulation.
   */
  None = 0,
  /**
   * Assumes that the physical key locations are correct,
   * fixes the character codes.
   */
  Forward = 1,
  /**
   * Assumes that the character codes are correct,
   * fixes the physical key locations.
   * It reverses the effect of layout emulation in hardware.
   */
  Reverse = 2,
}

export const keyboardProps = {
  language: itemProp("keyboard.language", Language.ALL, Language.EN),
  layout: xitemProp("keyboard.layout", Layout.ALL, Layout.EN_US),
  geometry: itemProp("keyboard.geometry", Geometry.ALL, Geometry.ANSI_101),
  zones: itemProp("keyboard.zones", ZoneMod.ALL, ZoneMod.STANDARD),
  emulation: enumProp("keyboard.emulation", Emulation, Emulation.Forward),
  colors: booleanProp("keyboard.colors", true),
  pointers: booleanProp("keyboard.pointers", true),
} as const;

export class KeyboardOptions {
  static default(): KeyboardOptions {
    return new KeyboardOptions(
      Language.EN,
      Layout.EN_US,
      Geometry.ANSI_101,
      ZoneMod.STANDARD,
    );
  }

  static from(settings: Settings): KeyboardOptions {
    const language = settings.get(keyboardProps.language);
    const layout = settings.get(keyboardProps.layout);
    const geometry = settings.get(keyboardProps.geometry);
    const zones = settings.get(keyboardProps.zones);
    return KeyboardOptions.default()
      .withLanguage(language)
      .withLayout(layout)
      .withGeometry(geometry)
      .withZones(zones);
  }

  readonly #language: Language;
  readonly #layout: Layout;
  readonly #geometry: Geometry;
  readonly #zones: ZoneMod;

  private constructor(
    language: Language,
    layout: Layout,
    geometry: Geometry,
    zones: ZoneMod,
  ) {
    this.#language = language;
    this.#layout = layout;
    this.#geometry = geometry;
    this.#zones = zones;
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

  get zones(): ZoneMod {
    return this.#zones;
  }

  selectableLanguages(): Language[] {
    return [...Language.ALL];
  }

  selectableLayouts(): Layout[] {
    return Layout.selectableLayouts(this.#language);
  }

  selectableGeometries(): Geometry[] {
    return [...this.#layout.geometries];
  }

  selectableZones(): ZoneMod[] {
    if (this.#layout.mod !== nullMod) {
      return [];
    }
    return [...this.#geometry.zones];
  }

  withLanguage(language: Language): KeyboardOptions {
    const layout = Layout.selectLayout(language);
    const geometry = Geometry.first(layout.geometries);
    const zones = ZoneMod.first(geometry.zones);
    return new KeyboardOptions(
      language, //
      layout,
      geometry,
      zones,
    );
  }

  withLayout(layout: Layout): KeyboardOptions {
    if (this.#language.script === layout.language.script) {
      const geometry = Geometry.first(layout.geometries);
      const zones = ZoneMod.first(geometry.zones);
      return new KeyboardOptions(
        this.#language, //
        layout,
        geometry,
        zones,
      );
    } else {
      return this;
    }
  }

  withGeometry(geometry: Geometry): KeyboardOptions {
    if (this.#layout.geometries.has(geometry)) {
      const zones = ZoneMod.first(geometry.zones);
      return new KeyboardOptions(
        this.#language, //
        this.#layout,
        geometry,
        zones,
      );
    } else {
      return this;
    }
  }

  withZones(zones: ZoneMod): KeyboardOptions {
    if (this.#layout.mod !== nullMod) {
      return this;
    }
    if (this.#geometry.zones.has(zones)) {
      return new KeyboardOptions(
        this.#language,
        this.#layout,
        this.#geometry,
        zones,
      );
    } else {
      return this;
    }
  }

  save(settings: Settings): Settings {
    return settings
      .set(keyboardProps.language, this.#language)
      .set(keyboardProps.layout, this.#layout)
      .set(keyboardProps.geometry, this.#geometry)
      .set(keyboardProps.zones, this.#zones);
  }
}
