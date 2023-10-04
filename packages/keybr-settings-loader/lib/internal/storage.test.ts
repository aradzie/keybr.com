import { fakeAdapter, Recorder } from "@fastr/fetch";
import { Settings, stringProp } from "@keybr/settings";
import test from "ava";
import { openSettingsStorage, STORAGE_KEY } from "./storage.ts";

test.beforeEach(() => {
  localStorage.clear();
  fakeAdapter.reset();
});

test.afterEach(() => {
  localStorage.clear();
  fakeAdapter.reset();
});

test.serial("anonymous user - store and load settings", async (t) => {
  // Arrange.

  const settings = new Settings().set(stringProp("prop", "abc"), "xyz");

  // Store settings.

  t.deepEqual(await openSettingsStorage(null, null).store(settings), settings);
  t.not(localStorage.getItem(STORAGE_KEY), null);

  // Load settings.

  t.deepEqual(await openSettingsStorage(null, null).load(), settings);
  t.not(localStorage.getItem(STORAGE_KEY), null);
});

test.serial("anonymous user - validate stored settings", async (t) => {
  // Load from garbage data.

  localStorage.setItem(STORAGE_KEY, "garbage");
  t.deepEqual(
    await openSettingsStorage(null, null).load(),
    new Settings(undefined, true),
  );

  // Load from valid data.

  localStorage.setItem(STORAGE_KEY, "{}");
  t.deepEqual(
    await openSettingsStorage(null, null).load(),
    new Settings(undefined, false),
  );
});

test.serial("anonymous user - detect new settings", async (t) => {
  // Load for the first time.

  t.true((await openSettingsStorage(null, null).load()).isNew);
  t.not(localStorage.getItem(STORAGE_KEY), null);

  // Load for the second time.

  t.false((await openSettingsStorage(null, null).load()).isNew);
  t.not(localStorage.getItem(STORAGE_KEY), null);
});

test.serial("named user - save to remote settings", async (t) => {
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

  t.deepEqual(stored, settings);
  t.is(localStorage.getItem(STORAGE_KEY), null);
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
  t.is(recorder.request?.body, JSON.stringify(settings.toJSON()));
});

test.serial("named user - load from remote settings", async (t) => {
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

  t.deepEqual(loaded, settings);
  t.is(localStorage.getItem(STORAGE_KEY), null);
  t.is(recorder.requestCount, 0);
  t.is(recorder.state, "not called");
});

test.serial("named user - load from local settings", async (t) => {
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

  t.deepEqual(loaded, settings);
  t.is(localStorage.getItem(STORAGE_KEY), null);
  t.is(recorder.requestCount, 1);
  t.is(recorder.state, "ended");
  t.is(recorder.request?.body, JSON.stringify(settings.toJSON()));
});

test.serial("named user - load default settings", async (t) => {
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

  t.deepEqual(loaded, settings);
  t.is(localStorage.getItem(STORAGE_KEY), null);
  t.is(recorder.requestCount, 0);
  t.is(recorder.state, "not called");
});
