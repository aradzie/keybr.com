import test from "ava";
import { DataDir } from "./datadir.ts";

test("get file name for user id", (t) => {
  const dataDir = new DataDir("/keybr");

  t.is(dataDir.userSettingsFile(1), "/keybr/user_settings/000/000/000000001");
  t.is(
    dataDir.userSettingsFile(123_456_789),
    "/keybr/user_settings/123/456/123456789",
  );
  t.is(dataDir.userStatsFile(1), "/keybr/user_stats/000/000/000000001");
  t.is(
    dataDir.userStatsFile(123_456_789),
    "/keybr/user_stats/123/456/123456789",
  );
});
