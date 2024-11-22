import { tryParseColor } from "@keybr/color";
import { TextField, useHotkeysHandler } from "@keybr/widget";
import { useEffect, useRef, useState } from "react";
import { type ColorEditorProps } from "./types.ts";

export function ColorInput({ color, onChange }: ColorEditorProps) {
  const focus = useRef(false);
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  useEffect(() => {
    if (!focus.current) {
      setError("");
      setValue(color.toRgb().formatHex());
    }
  }, [color]);
  const update = () => {
    const color = tryParseColor(value);
    if (color != null) {
      setError("");
      onChange(color);
    } else {
      setError("Invalid color. We accept hex, rgb(...), hsl(...), etc.");
    }
  };
  return (
    <TextField
      size="full"
      placeholder="hex, rgb(...), hsl(...), etc"
      error={error}
      value={value}
      onChange={setValue}
      onFocus={() => {
        focus.current = true;
      }}
      onBlur={() => {
        focus.current = false;
        update();
      }}
      onKeyDown={useHotkeysHandler({
        ["Enter"]: () => {
          update();
        },
      })}
    />
  );
}
