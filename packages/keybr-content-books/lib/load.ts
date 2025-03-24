import { Book, type Content } from "@keybr/content";

export async function loadContent(book: Book): Promise<Content> {
  switch (book) {
    case Book.EN_ALICE_WONDERLAND:
      return (
        await import(
          /* webpackChunkName: "book-en-alice-wonderland" */
          "./data/en-alice-wonderland.json",
          { with: { type: "json" } }
        )
      ).default as any;
    case Book.EN_JEKYLL_HYDE:
      return (
        await import(
          /* webpackChunkName: "book-en-jekyll-hyde" */
          "./data/en-jekyll-hyde.json",
          { with: { type: "json" } }
        )
      ).default as any;
    case Book.EN_CALL_WILD:
      return (
        await import(
          /* webpackChunkName: "book-en-call-wild" */
          "./data/en-call-wild.json",
          { with: { type: "json" } }
        )
      ).default as any;
    case Book.ES_MARIANELA:
      return (
        await import(
          /* webpackChunkName: "book-es-marianela" */
          "./data/es-marianela.json",
          { with: { type: "json" } }
        )
      ).default as any;
    case Book.DE_ALICE_WONDERLAND:
      return (
        await import(
          /* webpackChunkName: "book-de-alice-wonderland" */
          "./data/de-alice-wonderland.json",
          { with: { type: "json" } }
        )
      ).default as any;
    case Book.FR_ALICE_WONDERLAND:
      return (
        await import(
          /* webpackChunkName: "book-fr-alice-wonderland" */
          "./data/fr-alice-wonderland.json",
          { with: { type: "json" } }
        )
      ).default as any;
    default:
      throw new Error();
  }
}
