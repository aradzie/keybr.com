import test from "ava";
import { allLocales } from "./locale.ts";
import { loadMessages } from "./messages.ts";

for (const id of allLocales) {
  test(`load messages [${id}]`, async (t) => {
    await t.notThrowsAsync(async () => {
      await loadMessages(id);
    });
  });
}
