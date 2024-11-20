import { test } from "node:test";
import { isNotNull } from "rich-assert";
import { allLocales } from "./locale.ts";
import { loadMessages } from "./messages.ts";

for (const id of allLocales) {
  test(`load messages [${id}]`, async () => {
    isNotNull(await loadMessages(id));
  });
}
