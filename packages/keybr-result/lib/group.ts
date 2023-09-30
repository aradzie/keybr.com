import { type Layout, type LayoutFamily } from "@keybr/layout";
import { LocalDate } from "./localdate.ts";
import { type Result } from "./result.ts";

export type Group<T> = { key: T; results: Result[] };

export type KeyOf<T> = (result: Result) => T;

const layoutKey = (): KeyOf<Layout> => {
  return ({ layout }) => layout;
};

const layoutFamilyKey = (): KeyOf<LayoutFamily> => {
  return ({ layout }) => layout.family;
};

const dateKey = (): KeyOf<LocalDate> => {
  let date = new LocalDate(0);
  let next = new LocalDate(0);
  return (result) => {
    const { timeStamp } = result;
    if (!(date.timeStamp <= timeStamp && timeStamp < next.timeStamp)) {
      date = new LocalDate(timeStamp);
      next = date.plusDays(1);
    }
    return date;
  };
};

export class ResultGroups<T> implements Iterable<Group<T>> {
  static readonly byLayout = (results: Iterable<Result>) =>
    new ResultGroups<Layout>().addAll(results, layoutKey());

  static readonly byLayoutFamily = (results: Iterable<Result>) =>
    new ResultGroups<LayoutFamily>().addAll(results, layoutFamilyKey());

  static readonly byDate = (results: Iterable<Result>) =>
    new ResultGroups<LocalDate>().addAll(results, dateKey());

  readonly #map = new Map<string, Group<T>>();

  [Symbol.iterator](): IterableIterator<Group<T>> {
    return this.#map.values();
  }

  *keys(): IterableIterator<T> {
    for (const { key } of this.#map.values()) {
      yield key;
    }
  }

  get(key: T): Result[] {
    const stringKey = String(key);
    let group = this.#map.get(stringKey);
    if (group == null) {
      this.#map.set(stringKey, (group = { key, results: [] }));
    }
    return group.results;
  }

  add(key: T, result: Result): this {
    const stringKey = String(key);
    let group = this.#map.get(stringKey);
    if (group == null) {
      this.#map.set(stringKey, (group = { key, results: [] }));
    }
    group.results.push(result);
    return this;
  }

  addAll(results: Iterable<Result>, keyOf: KeyOf<T>): this {
    for (const result of results) {
      this.add(keyOf(result), result);
    }
    return this;
  }
}
