import { type CodePoint, toCodePoints } from "@keybr/unicode";

export type Word = readonly [word: string, count: number];

export function findWords(
  text: string,
  alphabet: readonly CodePoint[],
): Word[] {
  text = text.toLowerCase().normalize("NFC");
  const dict = new Map<string, number>();
  const regexp = /(\p{L}|'|-)+/gu;
  while (true) {
    const match = regexp.exec(text);
    if (match == null) {
      break;
    }
    const [word] = match;
    if (check(word, alphabet)) {
      dict.set(word, (dict.get(word) ?? 0) + 1);
    }
  }
  return sortByWord([...dict].filter(([word, count]) => count >= 3));
}

export function toCsv(words: readonly Word[]): string {
  return words.map(([word, count]) => `${word},${count}\n`).join("");
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

export function sortByWord(words: readonly Word[]): Word[] {
  return [...words].sort((a, b) => compareStrings(a[0], b[0]));
}

export function sortByCount(words: readonly Word[]): Word[] {
  return [...words].sort((a, b) => b[1] - a[1] || compareStrings(a[0], b[0]));
}

function compareStrings(a: string, b: string): number {
  if (a > b) {
    return +1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}

function check(word: string, alphabet: readonly CodePoint[]): boolean {
  for (const codePoint of toCodePoints(word)) {
    if (!alphabet.includes(codePoint)) {
      return false;
    }
  }
  return true;
}
