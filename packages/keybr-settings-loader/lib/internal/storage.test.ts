import { test } from "node:test";
import { fakeAdapter, Recorder } from "@fastr/fetch";
import { Settings, stringProp } from "@keybr/settings";
import { assert } from "chai";
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

  assert.deepStrictEqual(
    await openSettingsStorage(null, null).store(settings),
    settings,
  );
  assert.isNotNull(localStorage.getItem(STORAGE_KEY));

  // Load settings.

  assert.deepStrictEqual(
    await openSettingsStorage(null, null).load(),
    settings,
  );
  assert.isNotNull(localStorage.getItem(STORAGE_KEY));
});

test("anonymous user - validate stored settings", async () => {
  // Load from garbage data.

  localStorage.setItem(STORAGE_KEY, "garbage");
  assert.deepStrictEqual(
    await openSettingsStorage(null, null).load(),
    new Settings(undefined, true),
  );

  // Load from valid data.

  localStorage.setItem(STORAGE_KEY, "{}");
  assert.deepStrictEqual(
    await openSettingsStorage(null, null).load(),
    new Settings(undefined, false),
  );
});

test("anonymous user - detect new settings", async () => {
  // Load for the first time.

  assert.isTrue((await openSettingsStorage(null, null).load()).isNew);
  assert.isNotNull(localStorage.getItem(STORAGE_KEY));

  // Load for the second time.

  assert.isFalse((await openSettingsStorage(null, null).load()).isNew);
  assert.isNotNull(localStorage.getItem(STORAGE_KEY));
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

  assert.deepStrictEqual(stored, settings);
  assert.strictEqual(localStorage.getItem(STORAGE_KEY), null);
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
  assert.strictEqual(recorder.request?.body, JSON.stringify(settings.toJSON()));
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

  assert.deepStrictEqual(loaded, settings);
  assert.strictEqual(localStorage.getItem(STORAGE_KEY), null);
  assert.strictEqual(recorder.requestCount, 0);
  assert.strictEqual(recorder.state, "not called");
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

  assert.deepStrictEqual(loaded, settings);
  assert.strictEqual(localStorage.getItem(STORAGE_KEY), null);
  assert.strictEqual(recorder.requestCount, 1);
  assert.strictEqual(recorder.state, "ended");
  assert.strictEqual(recorder.request?.body, JSON.stringify(settings.toJSON()));
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

  assert.deepStrictEqual(loaded, settings);
  assert.strictEqual(localStorage.getItem(STORAGE_KEY), null);
  assert.strictEqual(recorder.requestCount, 0);
  assert.strictEqual(recorder.state, "not called");
});
