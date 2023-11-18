import { combineDiacritic, isDiacritic } from "./diacritics.ts";
import { KeyCombo } from "./keycombo.ts";
import { type KeyModifier } from "./keymodifier.ts";
import { type CodePoint, type KeyId } from "./types.ts";

const setCombo = (map: Map<CodePoint, KeyCombo>, combo: KeyCombo): void => {
  const oldCombo = map.get(combo.codePoint);
  if (oldCombo == null || oldCombo.complexity > combo.complexity) {
    map.set(combo.codePoint, combo);
  }
};

export const addCombo = (
  map: Map<CodePoint, KeyCombo>,
  codePoint: CodePoint,
  id: KeyId,
  modifier: KeyModifier,
): void => {
  if (codePoint > 0 && !isDiacritic(codePoint)) {
    setCombo(map, new KeyCombo(codePoint, id, modifier));
  }
};

export const addDeadCombo = (
  map: Map<CodePoint, KeyCombo>,
  codePoint: CodePoint,
  id: KeyId,
  modifier: KeyModifier,
): void => {
  if (codePoint > 0 && isDiacritic(codePoint)) {
    const prefix = new KeyCombo(codePoint, id, modifier);
    for (const combo of map.values()) {
      if (combo.prefix == null) {
        const combinedCodePoint = combineDiacritic(combo.codePoint, codePoint);
        if (combinedCodePoint !== combo.codePoint) {
          setCombo(
            map,
            new KeyCombo(combinedCodePoint, combo.id, combo.modifier, prefix),
          );
        }
      }
    }
  }
};
