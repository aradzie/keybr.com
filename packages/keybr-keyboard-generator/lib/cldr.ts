import { type CodePoint, getDiacritic, type KeyId } from "@keybr/keyboard";
import { toCodePoints } from "@keybr/unicode";
import { type Element } from "xml-js";
import { diacritics } from "./diacritics.ts";
import { type LayoutConfig } from "./layout.ts";
import { walkTree } from "./xml.ts";

const keyMapping: {
  readonly [iso: string]: KeyId;
} = {
  // Row E
  E00: "Backquote",
  E01: "Digit1",
  E02: "Digit2",
  E03: "Digit3",
  E04: "Digit4",
  E05: "Digit5",
  E06: "Digit6",
  E07: "Digit7",
  E08: "Digit8",
  E09: "Digit9",
  E10: "Digit0",
  E11: "Minus",
  E12: "Equal",
  // Row D
  D01: "KeyQ",
  D02: "KeyW",
  D03: "KeyE",
  D04: "KeyR",
  D05: "KeyT",
  D06: "KeyY",
  D07: "KeyU",
  D08: "KeyI",
  D09: "KeyO",
  D10: "KeyP",
  D11: "BracketLeft",
  D12: "BracketRight",
  D13: "Backslash",
  // Row C
  C01: "KeyA",
  C02: "KeyS",
  C03: "KeyD",
  C04: "KeyF",
  C05: "KeyG",
  C06: "KeyH",
  C07: "KeyJ",
  C08: "KeyK",
  C09: "KeyL",
  C10: "Semicolon",
  C11: "Quote",
  C12: "Backslash",
  // Row B
  B00: "IntlBackslash",
  B01: "KeyZ",
  B02: "KeyX",
  B03: "KeyC",
  B04: "KeyV",
  B05: "KeyB",
  B06: "KeyN",
  B07: "KeyM",
  B08: "Comma",
  B09: "Period",
  B10: "Slash",
  // Row A
  A03: "Space",
};

export function parseCldr(root: Element): LayoutConfig {
  unescape(root);

  const codePointsMap = new Map<KeyId, CodePoint[]>();

  const combiners = new Set<number>();

  const toCombining = (codePoint: number, keep: boolean): number => {
    if (keep || !combiners.has(codePoint)) {
      return codePoint;
    } else {
      const combining = diacritics.get(codePoint);
      if (combining == null) {
        throw new Error();
      }
      const diacritic = getDiacritic(combining);
      if (diacritic == null) {
        throw new Error();
      }
      return diacritic.codePoint;
    }
  };

  const handleTransform = (stack: readonly Element[], path: string) => {
    if (path === "/keyboard/transforms/transform") {
      const [_0, _1, transformsEl, transformEl] = stack;
      const typeAttr = (transformsEl.attributes?.type ?? "") as string;
      const fromAttr = (transformEl.attributes?.from ?? "") as string;
      const toAttr = (transformEl.attributes?.to ?? "") as string;

      if (typeAttr === "simple") {
        const fromCp = [...toCodePoints(fromAttr)];
        const toCp = [...toCodePoints(toAttr)];
        if (fromCp.length === 2 && toCp.length === 1) {
          combiners.add(fromCp[0]);
        }
      }
    }
  };

  const handleMap = (stack: readonly Element[], path: string) => {
    if (path === "/keyboard/keyMap/map") {
      const [_0, _1, keyMapEl, mapEl] = stack;
      const modifiersAttr = (keyMapEl.attributes?.modifiers ?? "") as string;
      const isoAttr = (mapEl.attributes?.iso ?? "") as string;
      const toAttr = (mapEl.attributes?.to ?? "") as string;
      const transformAttr = (mapEl.attributes?.transform ?? "") as string;

      const keyId = keyMapping[isoAttr];
      if (keyId == null) {
        console.error(`Unknown iso [${isoAttr}]`);
        return;
      }

      const codePoints = codePointsMap.get(keyId) ?? [];
      const toCp = [...toCodePoints(toAttr)];
      if (toCp.length === 1) {
        const codePoint = toCombining(toCp[0], transformAttr === "no");
        for (const modifier of parseModifiers(modifiersAttr)) {
          codePoints[modifier] = codePoint;
        }
      }
      codePointsMap.set(keyId, codePoints);
    }
  };

  walkTree(root, handleTransform);
  walkTree(root, handleMap);

  return { codePoints: Object.fromEntries(codePointsMap) };
}

function* parseModifiers(attr: string): Iterable<number> {
  if (attr === "") {
    yield 0;
  } else {
    for (const item of attr.split(/\s+/g)) {
      switch (item) {
        case "shift":
          yield 1;
          break;
        case "altR":
        case "altR+caps?":
          yield 2;
          break;
        case "shift+altR":
        case "shift+altR+caps?":
        case "altR+shift":
        case "altR+shift+caps?":
          yield 3;
          break;
      }
    }
  }
}

function unescape(root: Element): void {
  const { text, attributes, elements } = root;
  if (typeof text === "string") {
    root.text = unescapeCodePoints(text);
  }
  if (attributes != null) {
    for (const key of Object.keys(attributes)) {
      const value = attributes[key];
      if (typeof value === "string") {
        attributes[key] = unescapeCodePoints(value);
      }
    }
  }
  if (elements != null) {
    for (const element of elements) {
      unescape(element);
    }
  }
}

function unescapeCodePoints(v: string): string {
  return v.replace(/\\u\{([a-zA-Z0-9]+)\}/g, (_, m) =>
    String.fromCodePoint(Number.parseInt(m, 16)),
  );
}
