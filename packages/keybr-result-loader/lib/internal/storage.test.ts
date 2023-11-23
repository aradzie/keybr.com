import { type Result, ResultFaker } from "@keybr/result";
import test from "ava";
import { FakeLocalResultStorage, FakeRemoteResultSync } from "../fake/index.ts";
import {
  ResultStorageOfAnonymousUser,
  ResultStorageOfNamedUser,
  ResultStorageOfPublicUser,
  wrapResultStorage,
} from "./storage.ts";
import { type LocalResultStorage, type RemoteResultSync } from "./types.ts";

const faker = new ResultFaker();

test("named user - initially is empty", async (t) => {
  const local: Result[] = [];
  const remote: Result[] = [];

  const storage = wrapResultStorage(
    new ResultStorageOfNamedUser(
      new FakeLocalResultStorage(local),
      new FakeRemoteResultSync(remote),
    ),
  );

  const results = await storage.load();

  t.is(local.length, 0);
  t.is(remote.length, 0);
  t.is(results.length, 0);
});

test("named user - fetch remote and ignore local data", async (t) => {
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
  t.deepEqual(results, [r2, r3]);

  // Local store should not be modified.
  t.deepEqual(local, [r0, r1]);

  // Remote store should not be modified.
  t.deepEqual(remote, [r2, r3]);
});

test("named user - upload local to remote on first sync", async (t) => {
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
  t.deepEqual(results, [r0, r1]);

  // Local store should be cleared.
  t.deepEqual(local, []);

  // Remote store should be updated.
  t.deepEqual(remote, [r0, r1]);
});

test("anonymous user - append to local", async (t) => {
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
  t.deepEqual(results, [r0, r1]);

  // Local store should be updated.
  t.deepEqual(local, [r0, r1]);
});

test("named user - append to remote", async (t) => {
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
  t.deepEqual(results, [r0, r1]);

  // Local store should stay empty.
  t.deepEqual(local, []);

  // Remote store should be updated.
  t.deepEqual(remote, [r0, r1]);
});

test("public user - is readonly", async (t) => {
  const r0 = faker.nextResult();
  const r1 = faker.nextResult();
  const r2 = faker.nextResult({ length: 0, time: 0 });
  const remote: Result[] = [r0, r1, r2];

  const storage = wrapResultStorage(
    new ResultStorageOfPublicUser(new FakeRemoteResultSync(remote)),
  );

  const results = await storage.load();

  t.deepEqual(results, [r0, r1]);

  // Try to append.
  await t.throwsAsync(
    async () => {
      await storage.append([faker.nextResult()]);
    },
    {
      message: "Cannot add records to database",
    },
  );

  // Try to clear.
  await t.throwsAsync(
    async () => {
      await storage.clear();
    },
    {
      message: "Cannot clear database",
    },
  );
});

test("handle local storage errors", async (t) => {
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

  let error: Error & { cause?: Error };

  // Try to open.
  error = (await t.throwsAsync(
    async () => {
      await storage.load();
    },
    {
      message: "Cannot read records from database",
    },
  ))!;
  t.is(error.cause?.message, "Test read error");

  // Try to append.
  error = (await t.throwsAsync(
    async () => {
      await storage.append([faker.nextResult()]);
    },
    {
      message: "Cannot add records to database",
    },
  ))!;
  t.is(error.cause?.message, "Test add error");

  // Try to clear.
  error = (await t.throwsAsync(
    async () => {
      await storage.clear();
    },
    {
      message: "Cannot clear database",
    },
  ))!;
  t.is(error.cause?.message, "Test clear error");
});

test("handle remote sync errors", async (t) => {
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

  let error: Error & { cause?: Error };

  // Try to open.
  error = (await t.throwsAsync(
    async () => {
      await storage.load();
    },
    {
      message: "Cannot read records from database",
    },
  ))!;
  t.is(error.cause?.message, "Test receive error");

  // Try to append.
  error = (await t.throwsAsync(
    async () => {
      await storage.append([faker.nextResult()]);
    },
    {
      message: "Cannot add records to database",
    },
  ))!;
  t.is(error.cause?.message, "Test send error");

  // Try to clear.
  error = (await t.throwsAsync(
    async () => {
      await storage.clear();
    },
    {
      message: "Cannot clear database",
    },
  ))!;
  t.is(error.cause?.message, "Test clear error");
});
