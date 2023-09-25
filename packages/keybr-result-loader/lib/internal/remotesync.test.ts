import { fakeAdapter, Recorder } from "@fastr/fetch";
import { ResultFaker } from "@keybr/result";
import { formatFile } from "@keybr/result-io";
import test from "ava";
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

test.serial("named user - receive data", async (t) => {
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

  t.is(result.length, 3);
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - send data", async (t) => {
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

  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - clear data", async (t) => {
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

  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("public user - receive data", async (t) => {
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

  t.is(result.length, 3);
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("public user - send data", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.send(faker.nextResultList(1), () => {});
    },
    {
      name: "Error",
      message: "Disabled",
    },
  );
  t.is(recorder.requestCount, 0);
});

test.serial("public user - clear data", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.clear();
    },
    {
      name: "Error",
      message: "Disabled",
    },
  );
  t.is(recorder.requestCount, 0);
});

test.serial("anonymous user - receive data", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.receive(() => {});
    },
    {
      name: "Error",
      message: "Disabled",
    },
  );
  t.is(recorder.requestCount, 0);
});

test.serial("anonymous user - send data", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.send(faker.nextResultList(1), () => {});
    },
    {
      name: "Error",
      message: "Disabled",
    },
  );
  t.is(recorder.requestCount, 0);
});

test.serial("anonymous user - clear data", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.clear();
    },
    {
      name: "Error",
      message: "Disabled",
    },
  );
  t.is(recorder.requestCount, 0);
});

test.serial("named user - receive data - http status error", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.receive(() => {});
    },
    {
      name: "HttpError [500]",
      message: "Internal Server Error",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - receive data - invalid content type", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.receive(() => {});
    },
    {
      name: "HttpError [415]",
      message: "Unsupported Media Type",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - receive data - parse error", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.receive(() => {});
    },
    {
      name: "InvalidFormatError",
      message: "Invalid header",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - receive data - generic error", async (t) => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .GET("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await t.throwsAsync(
    async () => {
      await sync.receive(() => {});
    },
    {
      name: "Error",
      message: "What a terrible failure",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "failed");
});

test.serial("named user - send data - http status error", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.send([], () => {});
    },
    {
      name: "HttpError [500]",
      message: "Internal Server Error",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - send data - generic error", async (t) => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .POST("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await t.throwsAsync(
    async () => {
      await sync.send([], () => {});
    },
    {
      name: "Error",
      message: "What a terrible failure",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "failed");
});

test.serial("named user - clear data - http status error", async (t) => {
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

  await t.throwsAsync(
    async () => {
      await sync.clear();
    },
    {
      name: "HttpError [500]",
      message: "Internal Server Error",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
});

test.serial("named user - clear data - generic error", async (t) => {
  // Arrange.

  const sync = new ResultSyncNamedUser();
  const recorder = new Recorder();
  fakeAdapter.on
    .DELETE("/_/sync/data")
    .throwError(new Error("What a terrible failure"), recorder);

  // Assert.

  await t.throwsAsync(
    async () => {
      await sync.clear();
    },
    {
      name: "Error",
      message: "What a terrible failure",
    },
  );
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "failed");
});
