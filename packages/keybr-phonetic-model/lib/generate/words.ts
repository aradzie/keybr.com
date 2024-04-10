import { type Language } from "@keybr/keyboard";

export type Word = readonly [word: string, count: number];

export function toCsv(dict: readonly Word[]): string {
  return dict.map(([word, count]) => `${word},${count}\n`).join("");
}

export function fromCsv(text: string): Word[] {
  const words: Word[] = [];
  for (const line of text.split("\n")) {
    if (line) {
      const [col0, col1] = line.split(/,/);
      if (col0 && col1) {
        const count = Number(col1);
        if (count > 0) {
          words.push([col0, count]);
        }
      }
    }
  }
  return words;
}

export function sortByWord(language: Language, dict: readonly Word[]): Word[] {
  return [...dict].sort((a, b) => language.compare(a[0], b[0]));
}

export function sortByCount(language: Language, dict: readonly Word[]): Word[] {
  return [...dict].sort((a, b) => b[1] - a[1] || language.compare(a[0], b[0]));
}

export function normalizeCounts(dict: readonly Word[]): Word[] {
  const [min, max] = dict.reduce(
    ([min, max], [word, count]) => [Math.min(min, count), Math.max(max, count)],
    [Infinity, -Infinity],
  );
  return dict.map(([word, count]) => [word, count / min]);
}
