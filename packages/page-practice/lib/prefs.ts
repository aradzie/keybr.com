import { type AnyProp } from "@keybr/settings";

export class Prefs {
  static get<T>(prop: AnyProp<T>): T {
    return prop.fromJson(getItem(prop.key));
  }

  static set<T>(prop: AnyProp<T>, value: T): void {
    setItem(prop.key, prop.toJson(value));
  }
}

function getItem(key: string): unknown {
  const item = localStorage.getItem(key);
  if (item != null) {
    try {
      return JSON.parse(item);
    } catch {
      localStorage.removeItem(key);
    }
  }
  return null;
}

function setItem(key: string, value: unknown): void {
  if (value == null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
