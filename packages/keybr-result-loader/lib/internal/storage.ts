import { recoverResults, Result } from "@keybr/result";
import { DatabaseError } from "../errors.ts";
import { PersistentResultStorage } from "./local.ts";
import { ResultSyncNamedUser, ResultSyncPublicUser } from "./remotesync.ts";
import {
  type LocalResultStorage,
  type ProgressListener,
  type RemoteResultSync,
  type ResultStorage,
} from "./types.ts";

export type OpenRequest =
  | {
      // Load our own data.
      readonly type: "private";
      readonly userId: string | null;
    }
  | {
      // Load data of a public user.
      readonly type: "public";
      readonly userId: string;
    };

export function openResultStorage(request: OpenRequest): ResultStorage {
  return wrapResultStorage(openRawResultStorage(request));
}

export function wrapResultStorage(storage: ResultStorage): ResultStorage {
  return translateErrors(validateResults(storage));
}

function openRawResultStorage(
  request:
    | { readonly type: "private"; readonly userId: string | null }
    | {
        readonly type: "public";
        readonly userId: string;
      },
) {
  switch (request.type) {
    case "private": {
      const { userId } = request;
      if (userId == null) {
        const local = new PersistentResultStorage();
        return new ResultStorageOfAnonymousUser(local);
      } else {
        const local = new PersistentResultStorage();
        const remote = new ResultSyncNamedUser();
        return new ResultStorageOfNamedUser(local, remote);
      }
    }
    case "public": {
      const { userId } = request;
      const remote = new ResultSyncPublicUser(userId);
      return new ResultStorageOfPublicUser(remote);
    }
  }
}

function translateErrors(storage: ResultStorage): ResultStorage {
  return new (class ErrorTranslator implements ResultStorage {
    async load(progressListener?: ProgressListener): Promise<Result[]> {
      try {
        return await storage.load(progressListener);
      } catch (err: any) {
        throw new DatabaseError("Cannot read records from database", {
          cause: err,
        });
      }
    }

    async append(
      results: readonly Result[],
      progressListener?: ProgressListener,
    ): Promise<void> {
      try {
        await storage.append(results, progressListener);
      } catch (err: any) {
        throw new DatabaseError("Cannot add records to database", {
          cause: err,
        });
      }
    }

    async clear(): Promise<void> {
      try {
        await storage.clear();
      } catch (err: any) {
        throw new DatabaseError("Cannot clear database", {
          cause: err,
        });
      }
    }
  })();
}

function validateResults(storage: ResultStorage): ResultStorage {
  return new (class ErrorTranslator implements ResultStorage {
    async load(progressListener?: ProgressListener): Promise<Result[]> {
      return recoverResults(await storage.load(progressListener));
    }

    async append(
      results: readonly Result[],
      progressListener?: ProgressListener,
    ): Promise<void> {
      results = results.filter(Result.isValid);
      if (results.length > 0) {
        await storage.append(results, progressListener);
      }
    }

    async clear(): Promise<void> {
      await storage.clear();
    }
  })();
}

export class ResultStorageOfAnonymousUser implements ResultStorage {
  readonly #local: LocalResultStorage;

  constructor(local: LocalResultStorage) {
    this.#local = local;
  }

  async load(
    progressListener = (total: number, current: number) => {},
  ): Promise<Result[]> {
    return await this.#local.load();
  }

  async append(
    results: readonly Result[],
    progressListener = (total: number, current: number) => {},
  ): Promise<void> {
    await this.#local.append(results);
  }

  async clear(): Promise<void> {
    await this.#local.clear();
  }
}

export class ResultStorageOfNamedUser implements ResultStorage {
  readonly #local: LocalResultStorage;
  readonly #remote: RemoteResultSync;

  constructor(local: LocalResultStorage, remote: RemoteResultSync) {
    this.#local = local;
    this.#remote = remote;
  }

  async load(
    progressListener = (total: number, current: number) => {},
  ): Promise<Result[]> {
    const results = await this.#remote.receive(progressListener);
    if (results.length > 0) {
      return results;
    } else {
      const results = await this.#local.load();
      if (results.length > 0) {
        await this.#remote.send(results, progressListener);
        await this.#local.clear();
        return results;
      }
    }
    return [];
  }

  async append(
    results: readonly Result[],
    progressListener = (total: number, current: number) => {},
  ): Promise<void> {
    await this.#remote.send(results, progressListener);
  }

  async clear(): Promise<void> {
    await this.#remote.clear();
  }
}

export class ResultStorageOfPublicUser implements ResultStorage {
  readonly #remote: RemoteResultSync;

  constructor(remote: RemoteResultSync) {
    this.#remote = remote;
  }

  async load(
    progressListener = (total: number, current: number) => {},
  ): Promise<Result[]> {
    return await this.#remote.receive(progressListener);
  }

  async append(
    results: readonly Result[],
    progressListener = (total: number, current: number) => {},
  ): Promise<void> {
    throw new Error("Disabled");
  }

  async clear(): Promise<void> {
    throw new Error("Disabled");
  }
}
