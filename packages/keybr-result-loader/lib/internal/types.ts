import { type Result } from "@keybr/result";

/**
 * Listens for progress made while doing some work.
 */
export type ProgressListener = {
  /**
   * Listens for the work progress event.
   * @param total The total amount of work to perform.
   * @param current The amount of work completed so far.
   */
  (total: number, current: number): void;
};

/**
 * A composite result storage.
 */
export type ResultStorage = {
  load(pl?: ProgressListener): Promise<Result[]>;
  append(results: readonly Result[], pl?: ProgressListener): Promise<void>;
  clear(): Promise<void>;
};

/**
 * A result storage which keeps results in a local indexed DB.
 */
export type LocalResultStorage = {
  load(): Promise<Result[]>;
  append(results: readonly Result[]): Promise<void>;
  clear(): Promise<void>;
};

/**
 * A result storage which loads/sends results from/to the server.
 */
export type RemoteResultSync = {
  receive(pl: ProgressListener): Promise<Result[]>;
  send(results: readonly Result[], pl: ProgressListener): Promise<void>;
  clear(): Promise<void>;
};
