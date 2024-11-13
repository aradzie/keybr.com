import {
  parseCldr,
  parseKeymap,
  parseKlc,
  type ParseResult,
} from "./parser/index.ts";
import { decodeText } from "./text.ts";

export async function importLayout(
  data: ArrayBufferLike | Blob,
): Promise<ParseResult | null> {
  if (data instanceof Blob) {
    data = await data.arrayBuffer();
  }
  const text = decodeText(data);
  for (const parser of [parseCldr, parseKeymap, parseKlc]) {
    try {
      const result = parser(text);
      if (result.layout.size > 0) {
        return result;
      }
    } catch {
      /* Ignore. */
    }
  }
  return null;
}
