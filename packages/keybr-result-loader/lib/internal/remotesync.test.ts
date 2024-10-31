import { test } from "node:test";
import { fakeAdapter, Recorder } from "@fastr/fetch";
import { ResultFaker } from "@keybr/result";
import { formatFile } from "@keybr/result-io";
import { assert, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import {
  ResultSyncAnonymousUser,
  ResultSyncNamedUser,
  ResultSyncPublicUser,
} from "./remotesync.ts";

use(chaiAsPromised);

const faker = new ResultFaker();

test.beforeEach(() => {
  fakeAdapter.reset();
});

test.afterEach(() => {
  fakeAdapter.reset();
});

test("named user - receive data", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.GET("/_/sync/data").replyWith(
    formatFile(faker.nextResultList(3)),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Act.

  const result = await sync.receive(() => {});

  // Assert.

  assert.strictEqual(result.length, 3);
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - send data", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.POST("/_/sync/data").replyWith(
    new ArrayBuffer(0),
    {
      status: 204,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Act.

  await sync.send(faker.nextResultList(1), () => {});

  // Assert.

  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - clear data", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.DELETE("/_/sync/data").replyWith(
    new ArrayBuffer(0),
    {
      status: 204,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Act.

  await sync.clear();

  // Assert.

  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("public user - receive data", async () => {
  // Arrange.

  const sync = new ResultSyncPublicUser("abc");
  const recorder = new Recorder();
  fakeAdapter.on.GET("/_/sync/data/abc").replyWith(
    formatFile(faker.nextResultList(3)),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Act.

  const result = await sync.receive(() => {});

  // Assert.

  assert.strictEqual(result.length, 3);
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("public user - send data", async () => {
  // Arrange.

  const sync = new ResultSyncPublicUser("abc");
  const recorder = new Recorder();
  fakeAdapter.on.ANY(/.*/).replyWith(
    new ArrayBuffer(0),
    {
      status: 204,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.send(faker.nextResultList(1), () => {}),
    "Disabled",
  );
  assert.strictEqual(recorder.requestCount, 0);
});

test("public user - clear data", async () => {
  // Arrange.

  const sync = new ResultSyncPublicUser("abc");
  const recorder = new Recorder();
  fakeAdapter.on.ANY(/.*/).replyWith(
    new ArrayBuffer(0),
    {
      status: 204,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(sync.clear(), "Disabled");
  assert.strictEqual(recorder.requestCount, 0);
});

test("anonymous user - receive data", async () => {
  // Arrange.

  const sync = new ResultSyncAnonymousUser();
  const recorder = new Recorder();
  fakeAdapter.on.ANY(/.*/).replyWith(
    new ArrayBuffer(0),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.receive(() => {}),
    "Disabled",
  );
  assert.strictEqual(recorder.requestCount, 0);
});

test("anonymous user - send data", async () => {
  // Arrange.

  const sync = new ResultSyncAnonymousUser();
  const recorder = new Recorder();
  fakeAdapter.on.ANY(/.*/).replyWith(
    new ArrayBuffer(0),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.send(faker.nextResultList(1), () => {}),
    "Disabled",
  );
  assert.strictEqual(recorder.requestCount, 0);
});

test("anonymous user - clear data", async () => {
  // Arrange.

  const sync = new ResultSyncAnonymousUser();
  const recorder = new Recorder();
  fakeAdapter.on.ANY(/.*/).replyWith(
    new ArrayBuffer(0),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(sync.clear(), "Disabled");
  assert.strictEqual(recorder.requestCount, 0);
});

test("named user - receive data - http status error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.GET("/_/sync/data").replyWith(
    new ArrayBuffer(0),
    {
      status: 500,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.receive(() => {}),
    "Internal Server Error",
  );
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - receive data - invalid content type", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.GET("/_/sync/data").replyWith(
    new ArrayBuffer(0),
    {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.receive(() => {}),
    "Unsupported Media Type",
  );
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - receive data - parse error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.GET("/_/sync/data").replyWith(
    new ArrayBuffer(1),
    {
      status: 200,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.receive(() => {}),
    "Invalid header",
  );
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - receive data - generic error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .GET("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await assert.isRejected(
    sync.receive(() => {}),
    "What a terrible failure",
  );
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "failed");
});

test("named user - send data - http status error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.POST("/_/sync/data").replyWith(
    new ArrayBuffer(0),
    {
      status: 500,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(
    sync.send([], () => {}),
    "Internal Server Error",
  );
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - send data - generic error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .POST("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await assert.isRejected(
    sync.send([], () => {}),
    "What a terrible failure",
  );
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "failed");
});

test("named user - clear data - http status error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on.DELETE("/_/sync/data").replyWith(
    new ArrayBuffer(0),
    {
      status: 500,
      headers: { "Content-Type": "application/octet-stream" },
    },
    recorder,
  );

  // Assert.

  await assert.isRejected(sync.clear(), "Internal Server Error");
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
});

test("named user - clear data - generic error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .DELETE("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await assert.isRejected(sync.clear(), "What a terrible failure");
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "failed");
});
