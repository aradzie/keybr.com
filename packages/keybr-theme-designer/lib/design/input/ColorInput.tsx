import { type Color, parseColor } from "@keybr/color";
import { type CustomTheme, type PropName } from "@keybr/themes";
import {
  type AnchorProps,
  Flyout,
  type Focusable,
  type FocusProps,
  getBoundingBox,
  type KeyboardProps,
  type MouseProps,
  sizeClassName,
  type SizeName,
} from "@keybr/widget";
import { clsx } from "clsx";
import {
  type ForwardedRef,
  type ReactNode,
  useImperativeHandle,
  useRef,
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
  accessor: Accessor;
  size?: SizeName;
}) {
  const { theme, setTheme } = useCustomTheme();
  const color = accessor.getColor(theme);
  return (
    <Flyout>
      <Flyout.Trigger>
        <SwatchButton color={color} size={size} />
      </Flyout.Trigger>
      <Flyout.Content position="block-end-start" offset={10}>
        <div className={styles.popup}>
          <ColorPicker
            color={color}
            onChange={(color) => {
              setTheme(accessor.setColor(theme, color));
            }}
          />
        </div>
      </Flyout.Content>
    </Flyout>
  );
}

type SwatchButtonProps = {
  readonly color: Color;
  readonly ref?: ForwardedRef<Focusable | null>;
  readonly size?: SizeName;
  readonly title?: string;
} & FocusProps &
  MouseProps &
  KeyboardProps &
  AnchorProps;

function SwatchButton({
  anchor,
  color,
  ref,
  size,
  title,
  ...props
}: SwatchButtonProps): ReactNode {
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
      {...props}
      ref={element}
      className={clsx(styles.root, sizeClassName(size))}
      style={{
        backgroundColor: String(color),
      }}
      title={title}
    />
  );
}
