import { test } from "node:test";
import { assert } from "chai";
import { allLocales } from "./locale.ts";
import { loadMessages } from "./messages.ts";

for (const id of allLocales) {
  test(`load messages [${id}]`, async () => {
    assert.isNotNull(await loadMessages(id));
  });
}
