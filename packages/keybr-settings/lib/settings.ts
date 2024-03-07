import { isPlainObject } from "lodash";
import { type AnyProp } from "./props.ts";

export type SettingsStorage = {
  load(): Promise<Settings>;
  store(settings: Settings): Promise<Settings>;
};

export class Settings {
  private readonly _json: Record<string, unknown>;
  private readonly _isNew: boolean;

  constructor(
    json: Record<string, unknown> = Object.create(null),
    isNew: boolean = false,
  ) {
    if (!isPlainObject(json)) {
      throw new TypeError();
    }
    this._json = json;
    this._isNew = isNew;
  }

  get isNew(): boolean {
    return this._isNew;
  }

  get<T>(prop: AnyProp<T>): T {
    return prop.fromJson(this._json[prop.key]);
  }

  set<T>(prop: AnyProp<T>, value: T): Settings {
    return new Settings({ ...this._json, [prop.key]: prop.toJson(value) });
  }

  reset(): Settings {
    return new Settings();
  }

  toJSON(): Record<string, unknown> {
    const entries = [];
    for (const key of Object.keys(this._json).sort()) {
      entries.push([key, this._json[key]]);
    }
    return Object.fromEntries(entries);
  }

  static fromJSON(json: unknown): Settings {
    return new Settings(
      isPlainObject(json)
        ? (migrate(json) as Record<string, unknown>)
        : undefined,
    );
  }
}

function migrate(json: any): any {
  let layoutId = json["keyboard.layout"];
  if (typeof layoutId === "string") {
    const remap = {
      "be": "be-by",
      "cz": "cs-cz",
      "de": "de-de",
      "fr": "fr-fr",
      "it": "it-it",
      "pl": "pl-pl",
      "ru": "ru-ru",
      "se": "sv-se",
      "ua": "uk-ua",
      "uk": "en-uk",
      "us": "en-us",
      "us-canary-matrix": "en-canary-matrix",
      "us-colemak": "en-colemak",
      "us-colemak-dh": "en-colemak-dh",
      "us-colemak-dh-matrix": "en-colemak-dh-matrix",
      "us-dvorak": "en-dvorak",
      "us-workman": "en-workman",
    } as Record<string, string>;
    layoutId = remap[layoutId];
    if (typeof layoutId === "string") {
      json["keyboard.layout"] = layoutId;
    }
  }
  return json;
}
