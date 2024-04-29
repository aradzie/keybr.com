import { isPlainObject } from "@keybr/lang";
import { type AnyProp } from "./props.ts";

export type SettingsStorage = {
  load(): Promise<Settings>;
  store(settings: Settings): Promise<Settings>;
};

type Json = Record<string, unknown>;

let defaultJson: Json = createJson();

export class Settings {
  static addDefaults(settings: Settings): void {
    defaultJson = mergeJson(defaultJson, settings.#json);
  }

  readonly #json: Json;
  readonly #isNew: boolean;

  constructor(json: Json = createJson(), isNew: boolean = false) {
    if (!isPlainObject(json)) {
      throw new TypeError();
    }
    this.#json = migrate(cloneJson(json));
    this.#isNew = isNew;
  }

  get isNew(): boolean {
    return this.#isNew;
  }

  get<T>(prop: AnyProp<T>): T {
    return prop.fromJson(this.#json[prop.key] ?? defaultJson[prop.key]);
  }

  set<T>(prop: AnyProp<T>, value: T): Settings {
    return new Settings({ ...this.#json, [prop.key]: prop.toJson(value) });
  }

  reset(): Settings {
    return new Settings();
  }

  toJSON() {
    const entries = [];
    for (const key of Object.keys(this.#json).sort()) {
      entries.push([key, this.#json[key]]);
    }
    return Object.fromEntries(entries);
  }
}

function createJson(): Json {
  return Object.create(null);
}

function cloneJson(o: Json): Json {
  return Object.assign(createJson(), o);
}

function mergeJson(a: Json, b: Json): Json {
  return Object.assign(createJson(), a, b);
}

function migrate(json: Json): Json {
  return json;
}
