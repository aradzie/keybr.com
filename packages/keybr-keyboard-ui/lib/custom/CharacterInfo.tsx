import { type Character, KeyCharacters } from "@keybr/keyboard";
import { formatCodePoint, isDiacritic } from "@keybr/unicode";
import { clsx } from "clsx";
import * as styles from "./CharacterInfo.module.less";

export function CharacterInfo({
  character,
}: {
  readonly character: Character | null;
}) {
  if (character) {
    if (KeyCharacters.isCodePoint(character)) {
      let label;
      switch (character) {
        case 0x0020:
          label = "SPACE";
          break;
        case 0x00a0:
          label = "NBSP";
          break;
        default:
          label = (
            <span className={styles.char}>
              {String.fromCodePoint(character)}
            </span>
          );
          break;
      }
      return (
        <>
          {label} {formatCodePoint(character)}
        </>
      );
    }
    if (KeyCharacters.isDead(character)) {
      const { dead } = character;
      const label = (
        <span className={clsx(styles.char, styles.dead)}>
          {isDiacritic(dead)
            ? String.fromCodePoint(/* DOTTED CIRCLE */ 0x25cc, dead)
            : String.fromCodePoint(dead)}
        </span>
      );
      return (
        <>
          {label} {formatCodePoint(dead)}
        </>
      );
    }
    if (KeyCharacters.isLigature(character)) {
      return (
        <span className={clsx(styles.char, styles.ligature)}>
          {character.ligature}
        </span>
      );
    }
    if (KeyCharacters.isSpecial(character)) {
      return formatCodePoint(character.special);
    }
  }
  return <span className={styles.unassigned}>Unassigned</span>;
}
