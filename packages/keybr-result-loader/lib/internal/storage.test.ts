import { test } from "node:test";
import { type Result, ResultFaker } from "@keybr/result";
import { deepEqual, equal, rejects } from "rich-assert";
import { FakeLocalResultStorage, FakeRemoteResultSync } from "../fake/index.ts";
import {
  ResultStorageOfAnonymousUser,
  ResultStorageOfNamedUser,
  ResultStorageOfPublicUser,
  wrapResultStorage,
} from "./storage.ts";
import { type LocalResultStorage, type RemoteResultSync } from "./types.ts";

const faker = new ResultFaker();

test("named user - initially is empty", async () => {
  const local: Result[] = [];
  const remote: Result[] = [];

  const storage = wrapResultStorage(
    new ResultStorageOfNamedUser(
      new FakeLocalResultStorage(local),
      new FakeRemoteResultSync(remote),
    ),
  );

  const results = await storage.load();

  equal(local.length, 0);
  equal(remote.length, 0);
  equal(results.length, 0);
});

test("named user - fetch remote and ignore local data", async () => {
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();
  const r2 = faker.nextResult();
  const r3 = faker.nextResult();
  const local: Result[] = [r0, r1];
  const remote: Result[] = [r2, r3];

  const storage = wrapResultStorage(
    new ResultStorageOfNamedUser(
      new FakeLocalResultStorage(local),
      new FakeRemoteResultSync(remote),
    ),
  );

  const results = await storage.load();

  // Should contain data from remote store.
  deepEqual(results, [r2, r3]);

  // Local store should not be modified.
  deepEqual(local, [r0, r1]);

  // Remote store should not be modified.
  deepEqual(remote, [r2, r3]);
});

test("named user - upload local to remote on first sync", async () => {
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();
  const local: Result[] = [r0, r1];
  const remote: Result[] = [];

  const storage = wrapResultStorage(
    new ResultStorageOfNamedUser(
      new FakeLocalResultStorage(local),
      new FakeRemoteResultSync(remote),
    ),
  );

  const results = await storage.load();

  // Should contain data from updated remote store.
  deepEqual(results, [r0, r1]);

  // Local store should be cleared.
  deepEqual(local, []);

  // Remote store should be updated.
  deepEqual(remote, [r0, r1]);
});

test("anonymous user - append to local", async () => {
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();
  const r2 = faker.nextResult({ length: 0, time: 0 });
  const local: Result[] = [];

  const storage = wrapResultStorage(
    new ResultStorageOfAnonymousUser(new FakeLocalResultStorage(local)),
  );

  await storage.append([r0]);
  await storage.append([r1]);
  await storage.append([r2]);
  const results = await storage.load();

  // Should contain data from updated local store.
  deepEqual(results, [r0, r1]);

  // Local store should be updated.
  deepEqual(local, [r0, r1]);
});

test("named user - append to remote", async () => {
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();
  const r2 = faker.nextResult({ length: 0, time: 0 });
  const local: Result[] = [];
  const remote: Result[] = [];

  const storage = wrapResultStorage(
    new ResultStorageOfNamedUser(
      new FakeLocalResultStorage(local),
      new FakeRemoteResultSync(remote),
    ),
  );

  await storage.append([r0]);
  await storage.append([r1]);
  await storage.append([r2]);
  const results = await storage.load();

  // Should contain data from updated remote store.
  deepEqual(results, [r0, r1]);

  // Local store should stay empty.
  deepEqual(local, []);

  // Remote store should be updated.
  deepEqual(remote, [r0, r1]);
});

test("public user - is readonly", async () => {
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();
  const r2 = faker.nextResult({ length: 0, time: 0 });
  const remote: Result[] = [r0, r1, r2];

  const storage = wrapResultStorage(
    new ResultStorageOfPublicUser(new FakeRemoteResultSync(remote)),
  );

  const results = await storage.load();

  deepEqual(results, [r0, r1]);

  // Try to append.
  await rejects(
    storage.append([faker.nextResult()]),
    /Cannot add records to database/,
  );

  // Try to clear.
  await rejects(storage.clear(), /Cannot clear database/);
});

test("handle local storage errors", async () => {
  const storage = wrapResultStorage(
    new ResultStorageOfAnonymousUser(
      new (class FailingLocalResultStorage implements LocalResultStorage {
        async load(): Promise<Result[]> {
          throw new Error("Test read error");
        }

        async append(): Promise<void> {
          throw new Error("Test add error");
        }

        async clear(): Promise<void> {
          throw new Error("Test clear error");
        }
      })(),
    ),
  );

  // Try to open.
  await rejects(storage.load(), /Cannot read records from database/);

  // Try to append.
  await rejects(
    storage.append([faker.nextResult()]),
    /Cannot add records to database/,
  );

  // Try to clear.
  await rejects(storage.clear(), /Cannot clear database/);
});

test("handle remote sync errors", async () => {
  const storage = wrapResultStorage(
    new ResultStorageOfNamedUser(
      new FakeLocalResultStorage([]),
      new (class FailingRemoteResultSync implements RemoteResultSync {
        async receive(): Promise<Result[]> {
          throw new Error("Test receive error");
        }

        async send(): Promise<void> {
          throw new Error("Test send error");
        }

        async clear(): Promise<void> {
          throw new Error("Test clear error");
        }
      })(),
    ),
  );

  // Try to open.
  await rejects(storage.load(), /Cannot read records from database/);

  // Try to append.
  await rejects(
    storage.append([faker.nextResult()]),
    /Cannot add records to database/,
  );

  // Try to clear.
  await rejects(storage.clear(), /Cannot clear database/);
});
