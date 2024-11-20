import { test } from "node:test";
import { fakeAdapter, Recorder } from "@fastr/fetch";
import { Settings, stringProp } from "@keybr/settings";
import { deepEqual, equal, isFalse, isNotNull, isTrue } from "rich-assert";
import { openSettingsStorage, STORAGE_KEY } from "./storage.ts";

test.beforeEach(() => {
  localStorage.clear();
  fakeAdapter.reset();
});

test.afterEach(() => {
  localStorage.clear();
  fakeAdapter.reset();
});

test("anonymous user - store and load settings", async () => {
  // Arrange.

  const settings = new Settings().set(stringProp("prop", "abc"), "xyz");

  // Store settings.

  deepEqual(await openSettingsStorage(null, null).store(settings), settings);
  isNotNull(localStorage.getItem(STORAGE_KEY));

  // Load settings.

  deepEqual(await openSettingsStorage(null, null).load(), settings);
  isNotNull(localStorage.getItem(STORAGE_KEY));
});

test("anonymous user - validate stored settings", async () => {
  // Load from garbage data.

  localStorage.setItem(STORAGE_KEY, "garbage");
  deepEqual(
    await openSettingsStorage(null, null).load(),
    new Settings(undefined, true),
  );

  // Load from valid data.

  localStorage.setItem(STORAGE_KEY, "{}");
  deepEqual(
    await openSettingsStorage(null, null).load(),
    new Settings(undefined, false),
  );
});

test("anonymous user - detect new settings", async () => {
  // Load for the first time.

  isTrue((await openSettingsStorage(null, null).load()).isNew);
  isNotNull(localStorage.getItem(STORAGE_KEY));

  // Load for the second time.

  isFalse((await openSettingsStorage(null, null).load()).isNew);
  isNotNull(localStorage.getItem(STORAGE_KEY));
});

test("named user - save to remote settings", async () => {
  // Arrange.

  const recorder = new Recorder();
  fakeAdapter.on
    .PUT("/_/sync/settings")
    .replyWith("", { status: 204 }, recorder);
  const settings = new Settings().set(stringProp("prop", "abc"), "xyz");
  localStorage.removeItem(STORAGE_KEY);

  // Act.

  const stored = await openSettingsStorage("abc", null).store(settings);

  // Assert.

  deepEqual(stored, settings);
  equal(localStorage.getItem(STORAGE_KEY), null);
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
  equal(recorder.request?.body, JSON.stringify(settings.toJSON()));
});

test("named user - load from remote settings", async () => {
  // Arrange.

  const recorder = new Recorder();
  fakeAdapter.on
    .PUT("/_/sync/settings")
    .replyWith("", { status: 204 }, recorder);
  const settings = new Settings().set(stringProp("prop", "abc"), "xyz");
  localStorage.removeItem(STORAGE_KEY);

  // Act.

  const loaded = await openSettingsStorage("abc", settings.toJSON()).load();

  // Assert.

  deepEqual(loaded, settings);
  equal(localStorage.getItem(STORAGE_KEY), null);
  equal(recorder.requestCount, 0);
  equal(recorder.state, "not called");
});

test("named user - load from local settings", async () => {
  // Arrange.

  const recorder = new Recorder();
  fakeAdapter.on
    .PUT("/_/sync/settings")
    .replyWith("", { status: 204 }, recorder);
  const settings = new Settings().set(stringProp("prop", "abc"), "xyz");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.toJSON()));

  // Act.

  const loaded = await openSettingsStorage("abc", null).load();

  // Assert.

  deepEqual(loaded, settings);
  equal(localStorage.getItem(STORAGE_KEY), null);
  equal(recorder.requestCount, 1);
  equal(recorder.state, "ended");
  equal(recorder.request?.body, JSON.stringify(settings.toJSON()));
});

test("named user - load default settings", async () => {
  // Arrange.

  const recorder = new Recorder();
  fakeAdapter.on
    .PUT("/_/sync/settings")
    .replyWith("", { status: 204 }, recorder);
  const settings = new Settings();
  localStorage.removeItem(STORAGE_KEY);

  // Act.

  const loaded = await openSettingsStorage("abc", null).load();

  // Assert.

  deepEqual(loaded, settings);
  equal(localStorage.getItem(STORAGE_KEY), null);
  equal(recorder.requestCount, 0);
  equal(recorder.state, "not called");
});
