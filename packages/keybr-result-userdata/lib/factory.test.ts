import { DataDir } from "@keybr/config";
import { PublicId } from "@keybr/publicid";
import test from "ava";
import { UserDataFactory } from "./index.ts";

test("get file name for user id", (t) => {
  const factory = new UserDataFactory(new DataDir("/keybr"));

  t.is(
    factory.getFile(new PublicId(1)).name,
    "/keybr/user_stats/000/000/000000001",
  );
  t.is(
    factory.getFile(new PublicId(123_456_789)).name,
    "/keybr/user_stats/123/456/123456789",
  );
  t.throws(() => {
    factory.getFile(PublicId.example1);
  });
});
