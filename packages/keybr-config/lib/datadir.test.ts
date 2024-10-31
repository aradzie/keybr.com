import { test } from "node:test";
import { assert } from "chai";
import { DataDir } from "./datadir.ts";

test("get file name for user id", () => {
  const dataDir = new DataDir("/keybr");

  assert.strictEqual(
    dataDir.userSettingsFile(1),
    "/keybr/user_settings/000/000/000000001",
  );
  assert.strictEqual(
    dataDir.userSettingsFile(123_456_789),
    "/keybr/user_settings/123/456/123456789",
  );
  assert.strictEqual(
    dataDir.userStatsFile(1),
    "/keybr/user_stats/000/000/000000001",
  );
  assert.strictEqual(
    dataDir.userStatsFile(123_456_789),
    "/keybr/user_stats/123/456/123456789",
  );
});
