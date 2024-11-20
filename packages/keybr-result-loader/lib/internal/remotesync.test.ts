import { test } from "node:test";
import { fakeAdapter, Recorder } from "@fastr/fetch";
import { ResultFaker } from "@keybr/result";
import { formatFile } from "@keybr/result-io";
import { equal, rejects } from "rich-assert";
import {
  ResultSyncAnonymousUser,
  ResultSyncNamedUser,
  ResultSyncPublicUser,
} from "./remotesync.ts";

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

  equal(result.length, 3);
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
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

  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
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

  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
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

  equal(result.length, 3);
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
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

  await rejects(
    sync.send(faker.nextResultList(1), () => {}),
    /Disabled/,
  );
  equal(recorder.requestCount, 0);
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

  await rejects(sync.clear(), /Disabled/);
  equal(recorder.requestCount, 0);
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

  await rejects(
    sync.receive(() => {}),
    /Disabled/,
  );
  equal(recorder.requestCount, 0);
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

  await rejects(
    sync.send(faker.nextResultList(1), () => {}),
    /Disabled/,
  );
  equal(recorder.requestCount, 0);
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

  await rejects(sync.clear(), /Disabled/);
  equal(recorder.requestCount, 0);
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

  await rejects(
    sync.receive(() => {}),
    /Internal Server Error/,
  );
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
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

  await rejects(
    sync.receive(() => {}),
    /Unsupported Media Type/,
  );
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
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

  await rejects(
    sync.receive(() => {}),
    /Invalid header/,
  );
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
});

test("named user - receive data - generic error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .GET("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await rejects(
    sync.receive(() => {}),
    /What a terrible failure/,
  );
  equal(recorder.requestCount, 1);
  equal(recorder.state, "failed");
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

  await rejects(
    sync.send([], () => {}),
    /Internal Server Error/,
  );
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
});

test("named user - send data - generic error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .POST("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await rejects(
    sync.send([], () => {}),
    /What a terrible failure/,
  );
  equal(recorder.requestCount, 1);
  equal(recorder.state, "failed");
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

  await rejects(sync.clear(), /Internal Server Error/);
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
});

test("named user - clear data - generic error", async () => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .DELETE("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await rejects(sync.clear(), /What a terrible failure/);
  equal(recorder.requestCount, 1);
  equal(recorder.state, "failed");
});
