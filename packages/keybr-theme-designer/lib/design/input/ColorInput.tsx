import { type Color, parseColor } from "@keybr/color";
import { type CustomTheme, type PropName } from "@keybr/themes";
import {
  type AnchorProps,
  type Focusable,
  getBoundingBox,
  Popover,
  sizeClassName,
  type SizeName,
  useOnClickOutside,
} from "@keybr/widget";
import { clsx } from "clsx";
import {
  type ForwardedRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useCustomTheme } from "../context.ts";
import { ColorPicker } from "./color/index.ts";
import * as styles from "./ColorImport.module.less";

export const black = parseColor("#000000");
export const gray = parseColor("#999999");
export const white = parseColor("#FFFFFF");

export type Accessor = {
  readonly getColor: (theme: CustomTheme) => Color;
  readonly setColor: (theme: CustomTheme, color: Color) => CustomTheme;
};

export const makeAccessor = (prop: PropName): Accessor => {
  return {
    getColor: (theme) => theme.getColor(prop) ?? gray,
    setColor: (theme, color) => theme.set(prop, color),
  };
};

export function ColorInput({
  accessor,
  size,
}: {
  readonly accessor: Accessor;
  readonly size?: SizeName;
}) {
  const { theme, setTheme } = useCustomTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  useOnClickOutside(ref, () => {
    setOpen(false);
  });
  const color = accessor.getColor(theme);
  return (
    <Popover
      open={open}
      anchor={
        <SwatchButton
          color={color}
          size={size}
          onClick={() => {
            setOpen(!open);
          }}
        />
      }
      position="block-end-start"
      offset={10}
    >
      <div ref={ref} className={styles.popup}>
        <ColorPicker
          color={color}
          onChange={(color) => {
            setTheme(accessor.setColor(theme, color));
          }}
        />
      </div>
    </Popover>
  );
}

function SwatchButton({
  anchor,
  color,
  ref,
  size,
  onClick,
}: {
  color: Color;
  ref?: ForwardedRef<Focusable | null>;
  size?: SizeName;
  onClick: () => void;
} & AnchorProps) {
  const element = useRef<HTMLSpanElement>(null);
  useImperativeHandle(ref, () => ({
    focus() {
      element.current?.focus();
    },
    blur() {
      element.current?.blur();
    },
  }));
  useImperativeHandle(anchor, () => ({
    getBoundingBox() {
      return getBoundingBox(element.current!);
    },
  }));
  return (
    <span
      ref={element}
      className={clsx(styles.root, sizeClassName(size))}
      style={{
        backgroundColor: String(color),
      }}
      onClick={onClick}
    />
  );
}
