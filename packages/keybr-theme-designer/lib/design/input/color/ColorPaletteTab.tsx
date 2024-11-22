import { parseColor } from "@keybr/color";
import * as styles from "./ColorPaletteTab.module.less";
import { palette } from "./palette.ts";
import { type ColorEditorProps } from "./types.ts";

export function ColorPaletteTab({ color, onChange }: ColorEditorProps) {
  return (
    <div className={styles.root}>
      {Object.entries(palette).map(([name, colors]) => (
        <div key={name} className={styles.row}>
          {Object.entries(colors).map(([saturation, color]) => (
            <span
              key={saturation}
              className={styles.cell}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(parseColor(color));
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
