import { Book, type BookContent } from "@keybr/content";
import { render } from "@testing-library/react";
import test from "ava";
import { BookContentLoader } from "./BookContentLoader.tsx";

test.serial("load book", async (t) => {
  let ref = null as BookContent | null;

  const r = render(
    <BookContentLoader book={Book.EN_ALICE_WONDERLAND} fallback="fallback">
      {(result) => {
        ref = result;
        return <div>alice</div>;
      }}
    </BookContentLoader>,
  );

  await r.findByText("alice");

  t.is(ref?.book, Book.EN_ALICE_WONDERLAND);

  r.rerender(
    <BookContentLoader book={Book.EN_JEKYLL_HYDE} fallback="fallback">
      {(result) => {
        ref = result;
        return <div>jekyll</div>;
      }}
    </BookContentLoader>,
  );

  await r.findByText("jekyll");

  t.is(ref?.book, Book.EN_JEKYLL_HYDE);

  r.unmount();
});
