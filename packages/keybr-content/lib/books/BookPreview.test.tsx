import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { Book } from "./book.ts";
import { BookPreview } from "./BookPreview.tsx";

test.serial("render", (t) => {
  const r = render(
    <FakeIntlProvider>
      <BookPreview
        book={Book.EN_ALICE_WONDERLAND}
        content={[["chapter", ["one", "two", "three"]]]}
      />
    </FakeIntlProvider>,
  );

  t.true(r.container.textContent?.includes("Chapters:1"));
  t.true(r.container.textContent?.includes("Paragraphs:3"));
  t.true(r.container.textContent?.includes("All words:3"));
  t.true(r.container.textContent?.includes("Unique words:3"));
  t.true(r.container.textContent?.includes("Characters:11"));

  r.unmount();
});
