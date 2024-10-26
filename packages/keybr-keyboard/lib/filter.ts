import {
  type CodePoint,
  type CodePointSet,
  expand,
  isControl,
  isDiacritic,
  isLinebreak,
  isWhitespace,
  replace,
  toCodePoints,
} from "@keybr/unicode";

/**
 * Removes any illegal characters from the specified text, collapses whitespace.
 */
export function filterText(text: string, set: CodePointSet): string {
  let result = "";
  let ws = "";

  const append = (
    codePoint: CodePoint,
    s = String.fromCodePoint(codePoint),
  ) => {
    if (set.has(codePoint)) {
      if (ws !== "") {
        result += ws;
        ws = "";
      }
      result += s;
      return true;
    }
    return false;
  };

  const space = (char: string) => {
    if (result !== "" && ws !== "\n") {
      ws = char;
    }
  };

  for (let codePoint of toCodePoints(text.normalize())) {
    if (isLinebreak(codePoint)) {
      space("\n");
      continue;
    }
    if (isWhitespace(codePoint)) {
      space(" ");
      continue;
    }
    if (isControl(codePoint)) {
      space(" ");
      continue;
    }
    if (isDiacritic(codePoint)) {
      continue;
    }
    if (!append(codePoint)) {
      const a = expand(codePoint);
      if (a != null) {
        for (const letter of a) {
          append(letter);
        }
        continue;
      }
      const b = replace(codePoint);
      if (b != null) {
        if (!append(b, String.fromCodePoint(codePoint))) {
          space(" ");
        }
        continue;
      }
      space(" ");
    }
  }
  return result;
}

filterText.normalize = (codePoint: CodePoint): CodePoint => {
  return replace(codePoint) ?? codePoint;
};
