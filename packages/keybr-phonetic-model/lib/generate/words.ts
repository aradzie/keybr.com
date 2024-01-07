import { type CodePoint, toCodePoints } from "@keybr/unicode";

export type Word = readonly [word: string, count: number];

export function findWords(
  text: string,
  alphabet: readonly CodePoint[],
): Word[] {
  text = text.toLowerCase().normalize("NFC");
  const dict = new Map<string, number>();
  const word: CodePoint[] = [];
  const addWord = () => {
    if (word.length > 0) {
      const key = String.fromCodePoint(...word);
      dict.set(key, (dict.get(key) ?? 0) + 1);
      word.length = 0;
    }
  };
  for (const codePoint of toCodePoints(text)) {
    if (alphabet.includes(codePoint)) {
      word.push(codePoint);
    } else {
      addWord();
    }
  }
  addWord();

  return [...dict]
    .filter(([word, count]) => count >= 3)
    .sort((a, b) => compareStrings(a[0], b[0]));
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

function compareStrings(a: string, b: string): number {
  if (a > b) {
    return +1;
  }
  if (a < b) {
    return -1;
  }
  return 0;
}
