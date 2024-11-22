import { Icon } from "@keybr/widget";
import { mdiGrid, mdiPalette } from "@mdi/js";
import { useState } from "react";
import { ColorPaletteTab } from "./ColorPaletteTab.tsx";
import * as styles from "./ColorPicker.module.less";
import { ColorPickerTab } from "./ColorPickerTab.tsx";
import { type ColorEditorProps } from "./types.ts";

export function ColorPicker({ color, onChange }: ColorEditorProps) {
  const [tab, setTab] = useState(0);
  return (
    <div className={styles.root}>
      <div className={styles.tabs}>
        <span
          className={styles.tab}
          onClick={() => {
            setTab(0);
          }}
        >
          <Icon shape={mdiPalette} />
        </span>
        <span
          className={styles.tab}
          onClick={() => {
            setTab(1);
          }}
        >
          <Icon shape={mdiGrid} />
        </span>
      </div>
      {tab === 0 && <ColorPickerTab color={color} onChange={onChange} />}
      {tab === 1 && <ColorPaletteTab color={color} onChange={onChange} />}
    </div>
  );
}
