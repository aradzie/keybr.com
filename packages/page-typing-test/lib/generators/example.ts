import { type TextGenerator } from "./types.ts";

export function generateExample(
  textGenerator: TextGenerator,
  { numWords = 20 }: { readonly numWords?: number } = {},
): string {
  const words: string[] = [];
  const mark = textGenerator.mark();
  while (words.length < numWords) {
    words.push(textGenerator.nextWord());
  }
  textGenerator.reset(mark);
  return words.join(" ");
}
