import { type Result } from "@keybr/result";
import { type LocalResultStorage } from "../internal/types.ts";

export class FakeLocalResultStorage implements LocalResultStorage {
  readonly #results: Result[];

  constructor(results: Result[] = []) {
    this.#results = results;
  }

  async load(): Promise<Result[]> {
    return [...this.#results];
  }

  async append(results: readonly Result[]): Promise<void> {
    this.#results.push(...results);
  }

  async clear(): Promise<void> {
    this.#results.length = 0;
  }
}
