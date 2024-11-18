import { HslColor, RgbColor } from "@keybr/color";
import { Spacer } from "@keybr/widget";
import { ColorInput } from "./ColorInput.tsx";
import * as styles from "./ColorPicker.module.less";
import { Slider } from "./Slider.tsx";
import { Thumb } from "./Thumb.tsx";
import { type ColorEditorProps } from "./types.ts";

const red = new RgbColor(1, 0, 0);
const green = new RgbColor(0, 1, 0);
const blue = new RgbColor(0, 0, 1);

export function ColorPicker({ color, onChange }: ColorEditorProps) {
  const { h, s, l } = color.toHsl();
  const { r, g, b } = color.toRgb();
  const saturationValue = { x: s, y: l };
  const hueValue = { x: h, y: 0.5 };
  const hueColor = new HslColor(h, 1, 0.5);
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
          onChange(new HslColor(h, x, y));
        }}
      >
        <Thumb color={color.fade(1)} value={saturationValue} />
      </Slider>
      <Spacer size={1} />
      <Slider
        className={styles.hue}
        style={{
          backgroundImage: `linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)`,
        }}
        value={hueValue}
        onChange={({ x }) => {
          onChange(new HslColor(x, s, l));
        }}
      >
        <Thumb color={hueColor} value={hueValue} />
      </Slider>
      <Slider
        className={styles.channel}
        style={{
          backgroundImage: `linear-gradient(to right,#000,#f00)`,
        }}
        value={rValue}
        onChange={({ x }) => {
          onChange(new RgbColor(x, g, b));
        }}
      >
        <Thumb color={red} value={rValue} />
      </Slider>
      <Slider
        className={styles.channel}
        style={{
          backgroundImage: `linear-gradient(to right,#000,#0f0)`,
        }}
        value={gValue}
        onChange={({ x }) => {
          onChange(new RgbColor(r, x, b));
        }}
      >
        <Thumb color={green} value={gValue} />
      </Slider>
      <Slider
        className={styles.channel}
        style={{
          backgroundImage: `linear-gradient(to right,#000,#00f)`,
        }}
        value={gValue}
        onChange={({ x }) => {
          onChange(new RgbColor(r, g, x));
        }}
      >
        <Thumb color={blue} value={bValue} />
      </Slider>
      <ColorInput color={color} onChange={onChange} />
    </div>
  );
}
