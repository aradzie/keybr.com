import { isPlainObject } from "lodash";
import { type AnyProp } from "./props.ts";

export type SettingsStorage = {
  load(): Promise<Settings>;
  store(settings: Settings): Promise<Settings>;
};

export class Settings {
  readonly #json: Record<string, unknown>;
  readonly #isNew: boolean;

  constructor(
    json: Record<string, unknown> = Object.create(null),
    isNew: boolean = false,
  ) {
    if (!isPlainObject(json)) {
      throw new TypeError();
    }
    this.#json = json;
    this.#isNew = isNew;
  }

  get isNew(): boolean {
    return this.#isNew;
  }

  get<T>(prop: AnyProp<T>): T {
    return prop.fromJson(this.#json[prop.key]);
  }

  set<T>(prop: AnyProp<T>, value: T): Settings {
    return new Settings({ ...this.#json, [prop.key]: prop.toJson(value) });
  }

  toJSON(): Record<string, unknown> {
    const entries = [];
    for (const key of Object.keys(this.#json).sort()) {
      entries.push([key, this.#json[key]]);
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
  for (const [from, to] of [
    ["layout", "keyboard.layout"],
    ["emulateLayout", "keyboard.emulate"],
    ["lesson.complexity", "lesson.guided.alphabetSize"],
    ["lesson.wordListSize", "lesson.wordList.wordListSize"],
    ["lesson.text.content", "lesson.customText.content"],
    ["lesson.text.simplify", "lesson.customText.lettersOnly"],
    ["lesson.text.lowercase", "lesson.customText.lowercase"],
    ["lesson.text.randomize", "lesson.customText.randomize"],
  ]) {
    if (from in json) {
      json[to] = json[from];
      delete json[from];
    }
  }
  return json;
}
