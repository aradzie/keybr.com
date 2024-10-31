import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import { assert } from "chai";
import { Book } from "./book.ts";
import { BookPreview } from "./BookPreview.tsx";

test("render", () => {
  const r = render(
    <FakeIntlProvider>
      <BookPreview
        book={Book.EN_ALICE_WONDERLAND}
        content={[["chapter", ["one", "two", "three"]]]}
      />
    </FakeIntlProvider>,
  );

  assert.include(r.container.textContent, "Chapters:1");
  assert.include(r.container.textContent, "Paragraphs:3");
  assert.include(r.container.textContent, "All words:3");
  assert.include(r.container.textContent, "Unique words:3");
  assert.include(r.container.textContent, "Characters:11");

  r.unmount();
});
