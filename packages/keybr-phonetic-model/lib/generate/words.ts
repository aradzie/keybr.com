import { type CodePoint, toCodePoints } from "@keybr/unicode";

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

export function sortByWord(dict: readonly Word[]): Word[] {
  return [...dict].sort((a, b) => compareStrings(a[0], b[0]));
}

export function sortByCount(dict: readonly Word[]): Word[] {
  return [...dict].sort((a, b) => b[1] - a[1] || compareStrings(a[0], b[0]));
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

export function checkWord(
  word: string,
  alphabet: readonly CodePoint[],
): boolean {
  for (const codePoint of toCodePoints(word)) {
    if (!alphabet.includes(codePoint)) {
      return false;
    }
  }
  return true;
}
