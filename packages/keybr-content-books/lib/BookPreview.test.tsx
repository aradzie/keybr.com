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

  t.true(r.container.textContent?.includes("1 chapters"));
  t.true(r.container.textContent?.includes("3 paragraphs"));
  t.true(r.container.textContent?.includes("3 words"));
  t.true(r.container.textContent?.includes("3 unique words"));
  t.true(r.container.textContent?.includes("11 characters"));

  r.unmount();
});
