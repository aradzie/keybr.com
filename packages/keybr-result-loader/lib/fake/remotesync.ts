import { type Result } from "@keybr/result";
import {
  type ProgressListener,
  type RemoteResultSync,
} from "../internal/types.ts";

export class FakeRemoteResultSync implements RemoteResultSync {
  readonly #results: Result[];

  constructor(results: Result[] = []) {
    this.#results = results;
  }

  async send(
    results: readonly Result[],
    progressListener: ProgressListener,
  ): Promise<void> {
    this.#results.push(...results);
  }

  async receive(progressListener: ProgressListener): Promise<Result[]> {
    return [...this.#results];
  }

  async clear(): Promise<void> {
    this.#results.length = 0;
  }
}
