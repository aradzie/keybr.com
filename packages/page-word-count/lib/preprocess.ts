import { Parser } from "commonmark";

export type InputKind = "plain_text" | "markdown";

export function preprocess(kind: InputKind, text: string): string {
  switch (kind) {
    case "plain_text":
      return parsePlainText(text);
    case "markdown":
      return parseMarkdown(text);
  }
}

export function parsePlainText(text: string): string {
  return text;
}

export function parseMarkdown(text: string): string {
  const parser = new Parser({ smart: true });
  const doc = parser.parse(text);
  const walker = doc.walker();
  let step;
  while ((step = walker.next())) {
    const {
      entering,
      node: { type, literal, isContainer },
    } = step;
    switch (type) {
      case "text":
        break;
      case "softbreak":
        break;
      case "linebreak":
        break;
      case "document":
        break;
      case "heading":
        break;
      case "paragraph":
        break;
      case "block_quote":
        break;
      case "list":
        break;
      case "item":
        break;
      case "emph":
        break;
      case "strong":
        break;
      case "link":
        break;
      case "image":
        break;
      case "code_block":
        break;
      case "code":
        break;
      case "html_block":
        break;
      case "html_inline":
        break;
      case "thematic_break":
        break;
      case "custom_inline":
        break;
      case "custom_block":
        break;
    }
  }
  return text;
}
