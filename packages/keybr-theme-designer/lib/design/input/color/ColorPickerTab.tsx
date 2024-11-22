import { HsvColor, RgbColor } from "@keybr/color";
import { Spacer } from "@keybr/widget";
import { ColorInput } from "./ColorInput.tsx";
import * as styles from "./ColorPickerTab.module.less";
import { Slider } from "./Slider.tsx";
import { Thumb } from "./Thumb.tsx";
import { type ColorEditorProps } from "./types.ts";

export function ColorPickerTab({ color, onChange }: ColorEditorProps) {
  const { h, s, v } = color.toHsv();
  const { r, g, b } = color.toRgb();
  const saturationValue = { x: s, y: v };
  const hueValue = { x: h, y: 0.5 };
  const hueColor = new HsvColor(h, 1, 1);
  const rValue = { x: r, y: 0.5 };
  const gValue = { x: g, y: 0.5 };
  const bValue = { x: b, y: 0.5 };
  return (
    <div className={styles.root}>
      <Slider
        className={styles.saturation}
        style={{
          backgroundColor: String(hueColor),
          backgroundImage: `linear-gradient(0deg,#000,transparent),linear-gradient(90deg,#fff,hsla(0,0%,100%,0))`,
        }}
        value={saturationValue}
        onChange={({ x, y }) => {
          onChange(new HsvColor(h, x, y));
        }}
      >
        <Thumb color={color} value={saturationValue} />
      </Slider>
      <Spacer size={1} />
      <Slider
        className={styles.hue}
        style={{
          backgroundImage: `linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)`,
        }}
        value={hueValue}
        onChange={({ x }) => {
          onChange(new HsvColor(x, s, v));
        }}
      >
        <Thumb color={hueColor} value={hueValue} />
      </Slider>
      <Slider
        className={styles.channel}
        style={{
          backgroundImage: `linear-gradient(to right,${new RgbColor(0, g, b)},${new RgbColor(1, g, b)})`,
        }}
        value={rValue}
        onChange={({ x }) => {
          onChange(new RgbColor(x, g, b));
        }}
      >
        <Thumb color={color} value={rValue} />
      </Slider>
      <Slider
        className={styles.channel}
        style={{
          backgroundImage: `linear-gradient(to right,${new RgbColor(r, 0, b)},${new RgbColor(r, 1, b)})`,
        }}
        value={gValue}
        onChange={({ x }) => {
          onChange(new RgbColor(r, x, b));
        }}
      >
        <Thumb color={color} value={gValue} />
      </Slider>
      <Slider
        className={styles.channel}
        style={{
          backgroundImage: `linear-gradient(to right,${new RgbColor(r, g, 0)},${new RgbColor(r, g, 1)})`,
        }}
        value={gValue}
        onChange={({ x }) => {
          onChange(new RgbColor(r, g, x));
        }}
      >
        <Thumb color={color} value={bValue} />
      </Slider>
      <ColorInput color={color} onChange={onChange} />
    </div>
  );
}
