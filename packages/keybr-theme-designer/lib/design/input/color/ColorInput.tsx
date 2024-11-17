import { tryParseColor } from "@keybr/color";
import { TextField } from "@keybr/widget";
import { useEffect, useRef, useState } from "react";
import type { ColorEditorProps } from "./types.ts";

export function ColorInput({ color, onChange }: ColorEditorProps) {
  const focus = useRef(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (!focus.current) {
      setValue(String(color.toRgb()));
    }
  }, [color]);
  return (
    <TextField
      size="full"
      placeholder="hex, rgb, hsl, etc..."
      value={value}
      onChange={setValue}
      onFocus={() => {
        focus.current = true;
      }}
      onBlur={() => {
        focus.current = false;
        const color = tryParseColor(value);
        if (color != null) {
          onChange(color);
        }
      }}
    />
  );
}
