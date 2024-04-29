import {
  isControl,
  isLetter,
  isLinebreak,
  isWhitespace,
  isWordJoiner,
} from "./classify.ts";
import { newScanner } from "./scanner.ts";
import { type CodePoint } from "./types.ts";

export type TextScanner = {
  readonly text: string;
  readonly index: number;
  readonly end: boolean;
  reset(): void;
  next(): CodePoint;
  scanWhitespace(): boolean;
  scanNonWhitespace(maxLength?: number): boolean;
  scanWord(maxLength?: number): boolean;
  readonly scannedLength: number;
  readonly scannedText: string;
  readonly seenWhitespace: boolean;
  readonly seenLinebreak: boolean;
};

export function newTextScanner(text: string): TextScanner {
  const scanner = newScanner(text);
  let scannedLength = 0;
  let scannedText = "";
  let seenWhitespace = false;
  let seenLinebreak = false;

  const startScan = (): void => {
    scannedLength = 0;
    scannedText = "";
    seenWhitespace = false;
    seenLinebreak = false;
  };

  const getResult = (begin: number): boolean => {
    if (scannedLength > 0) {
      scannedText = scanner.text.substring(begin, scanner.index);
      return true;
    } else {
      scannedText = "";
      return false;
    }
  };

  return new (class implements TextScanner {
    get text(): string {
      return scanner.text;
    }

    get index(): number {
      return scanner.index;
    }

    get end(): boolean {
      return scanner.end;
    }

    reset(): void {
      scanner.reset();
      startScan();
    }

    next(): CodePoint {
      return scanner.next();
    }

    scanWhitespace(): boolean {
      startScan();
      const begin = scanner.index;
      while (!scanner.end) {
        const codePoint = scanner.lookAhead(0);
        if (isLinebreak(codePoint)) {
          scannedLength += 1;
          seenLinebreak = true;
          scanner.next();
          continue;
        }
        if (isControl(codePoint) || isWhitespace(codePoint)) {
          scannedLength += 1;
          seenWhitespace = true;
          scanner.next();
          continue;
        }
        break;
      }
      return getResult(begin);
    }

    scanNonWhitespace(maxLength?: number): boolean {
      startScan();
      const begin = scanner.index;
      while (!scanner.end) {
        if (maxLength && scannedLength === maxLength) {
          break;
        }
        const codePoint = scanner.lookAhead(0);
        if (isControl(codePoint) || isWhitespace(codePoint)) {
          break;
        }
        scannedLength += 1;
        scanner.next();
      }
      return getResult(begin);
    }

    scanWord(maxLength?: number): boolean {
      startScan();
      const begin = scanner.index;
      while (!scanner.end) {
        if (maxLength && scannedLength === maxLength) {
          break;
        }
        const codePoint = scanner.lookAhead(0);
        if (isLetter(codePoint)) {
          scannedLength += 1;
          scanner.next();
          continue;
        }
        if (
          scannedLength > 0 &&
          isWordJoiner(codePoint) &&
          isLetter(scanner.lookAhead(1))
        ) {
          scannedLength += 1;
          scanner.next();
          continue;
        }
        break;
      }
      return getResult(begin);
    }

    get scannedLength(): number {
      return scannedLength;
    }

    get scannedText(): string {
      return scannedText;
    }

    get seenWhitespace(): boolean {
      return seenWhitespace;
    }

    get seenLinebreak(): boolean {
      return seenLinebreak;
    }
  })();
}
