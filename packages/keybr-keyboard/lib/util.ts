import { combineDiacritic, isDiacritic } from "./diacritics.ts";
import { type KeyboardKey } from "./keyboardkey.ts";
import { KeyCombo } from "./keycombo.ts";
import { type KeyModifier } from "./keymodifier.ts";
import { type CodePoint } from "./types.ts";

const setKeyCombo = (
  map: Map<CodePoint, KeyCombo>,
  keyCombo: KeyCombo,
): void => {
  const oldKeyCombo = map.get(keyCombo.codePoint);
  if (oldKeyCombo == null || oldKeyCombo.complexity > keyCombo.complexity) {
    map.set(keyCombo.codePoint, keyCombo);
  }
};

export const addKeyCombo = (
  map: Map<CodePoint, KeyCombo>,
  codePoint: CodePoint,
  key: KeyboardKey,
  modifier: KeyModifier,
): void => {
  if (codePoint > 0 && !isDiacritic(codePoint)) {
    setKeyCombo(map, new KeyCombo(codePoint, key, modifier));
  }
};

export const addDeadKeyCombo = (
  map: Map<CodePoint, KeyCombo>,
  codePoint: CodePoint,
  key: KeyboardKey,
  modifier: KeyModifier,
): void => {
  const prefix = new KeyCombo(codePoint, key, modifier);
  if (codePoint > 0 && isDiacritic(codePoint)) {
    for (const keyCombo of map.values()) {
      if (keyCombo.prefix == null) {
        const combinedCodePoint = combineDiacritic(
          keyCombo.codePoint,
          codePoint,
        );
        if (combinedCodePoint !== keyCombo.codePoint) {
          setKeyCombo(
            map,
            new KeyCombo(
              combinedCodePoint,
              keyCombo.key,
              keyCombo.modifier,
              prefix,
            ),
          );
        }
      }
    }
  }
};
