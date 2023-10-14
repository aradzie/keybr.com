import { newTextScanner } from "@keybr/plaintext";

export function splitText(text: string, maxWordLength: number = 30): string[] {
  const scanner = newTextScanner(text);
  const words = [];
  while (!scanner.end) {
    scanner.scanWhitespace();
    if (scanner.scanNonWhitespace(maxWordLength)) {
      words.push(scanner.scannedText);
    }
  }
  return words;
}
