import { type CustomTheme, type PropName } from "@keybr/themes";
import {
  type AnchorProps,
  Color,
  type Focusable,
  getBoundingBox,
  Icon,
  IconButton,
  Popover,
  sizeClassName,
  type SizeName,
  useOnClickOutside,
} from "@keybr/widget";
import { mdiMenuLeft, mdiMenuRight } from "@mdi/js";
import { clsx } from "clsx";
import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { HexColorPicker } from "react-colorful";
import { useCustomTheme } from "../context/context.ts";
import * as styles from "./ColorImport.module.less";

export const black = Color.parse("#000000");
export const gray = Color.parse("#999999");
export const white = Color.parse("#FFFFFF");

export type Accessor = {
  readonly getColor: (theme: CustomTheme) => Color;
  readonly setColor: (theme: CustomTheme, color: Color) => CustomTheme;
};

export const makeAccessor = (prop: PropName): Accessor => {
  return {
    getColor: (theme) => theme.getColor(prop) ?? gray,
    setColor: (theme, color) => theme.set(prop, color),
  } as Accessor;
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
        <Button
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
        <HexColorPicker
          color={color.toRgb().formatHex()}
          onChange={(hex) => {
            setTheme(accessor.setColor(theme, Color.parse(hex)));
          }}
        />
        <div className={styles.adjust}>
          <IconButton
            icon={<Icon shape={mdiMenuLeft} />}
            onClick={() => {
              setTheme(accessor.setColor(theme, color.lighten(-1 / 255)));
            }}
          />
          <span className={styles.label}>lightness</span>
          <IconButton
            icon={<Icon shape={mdiMenuRight} />}
            onClick={() => {
              setTheme(accessor.setColor(theme, color.lighten(+1 / 255)));
            }}
          />
        </div>
        <div className={styles.adjust}>
          <IconButton
            icon={<Icon shape={mdiMenuLeft} />}
            onClick={() => {
              setTheme(accessor.setColor(theme, color.saturate(-1 / 255)));
            }}
          />
          <span className={styles.label}>saturation</span>
          <IconButton
            icon={<Icon shape={mdiMenuRight} />}
            onClick={() => {
              setTheme(accessor.setColor(theme, color.saturate(+1 / 255)));
            }}
          />
        </div>
      </div>
    </Popover>
  );
}

const Button = forwardRef(function Button(
  {
    anchor,
    color,
    disabled,
    size,
    onClick,
  }: {
    readonly color: Color;
    readonly size?: SizeName;
    readonly onClick: () => void;
  } & AnchorProps,
  ref: ForwardedRef<Focusable>,
) {
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
    getBoundingBox(position) {
      return getBoundingBox(element.current!, position);
    },
  }));
  return (
    <span
      ref={element}
      className={clsx(styles.root, sizeClassName(size))}
      style={{
        backgroundColor: color.toRgb().formatHex(),
      }}
      onClick={onClick}
    />
  );
});
