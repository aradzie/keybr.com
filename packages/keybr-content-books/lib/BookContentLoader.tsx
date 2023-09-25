import { catchError } from "@keybr/debug";
import { type ReactNode, useEffect, useState } from "react";
import { type Book } from "./book.ts";
import { loadContent } from "./load.ts";
import { type BookContent } from "./types.ts";

export function BookContentLoader({
  book,
  children,
  fallback,
}: {
  readonly book: Book;
  readonly children: (result: BookContent) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  return (
    <Loader key={book.id} book={book} fallback={fallback}>
      {children}
    </Loader>
  );
}

function Loader({
  book,
  children,
  fallback,
}: {
  readonly book: Book;
  readonly children: (result: BookContent) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const result = useLoader(book);
  if (result == null) {
    return fallback;
  } else {
    return children(result);
  }
}

function useLoader(book: Book): BookContent | null {
  const [bookContent, setBookContent] = useState<BookContent | null>(null);

  useEffect(() => {
    let didCancel = false;

    loadContent(book)
      .then((content) => {
        if (!didCancel) {
          setBookContent({ book, content });
        }
      })
      .catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [book]);

  return bookContent;
}
