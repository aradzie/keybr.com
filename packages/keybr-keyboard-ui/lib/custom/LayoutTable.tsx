import { KeyCharacters, KeyModifier } from "@keybr/keyboard";
import { LayoutBuilder } from "@keybr/keyboard-io";
import { CharacterInfo } from "./CharacterInfo.tsx";
import { useCustomLayout } from "./context.tsx";
import * as styles from "./LayoutTable.module.less";
import { ModifierInfo } from "./ModifierInfo.tsx";

export function LayoutTable() {
  const { layout } = useCustomLayout();
  return (
    <div className={styles.root}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.row}>
            <th className={styles.keyCol}>Key</th>
            <th className={styles.characterCol}>
              <ModifierInfo modifier={KeyModifier.None} />
            </th>
            <th className={styles.characterCol}>
              <ModifierInfo modifier={KeyModifier.Shift} />
            </th>
            <th className={styles.characterCol}>
              <ModifierInfo modifier={KeyModifier.Alt} />
            </th>
            <th className={styles.characterCol}>
              <ModifierInfo modifier={KeyModifier.ShiftAlt} />
            </th>
          </tr>
        </thead>
        <tbody>
          {LayoutBuilder.allKeys().map((id) => {
            const { a, b, c, d } =
              layout.get(id) ?? new KeyCharacters(id, null, null, null, null);
            return (
              <tr key={id} className={styles.row}>
                <td className={styles.keyCol}>{id}</td>
                <td className={styles.characterCol}>
                  <CharacterInfo character={a} />
                </td>
                <td className={styles.characterCol}>
                  <CharacterInfo character={b} />
                </td>
                <td className={styles.characterCol}>
                  <CharacterInfo character={c} />
                </td>
                <td className={styles.characterCol}>
                  <CharacterInfo character={d} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
