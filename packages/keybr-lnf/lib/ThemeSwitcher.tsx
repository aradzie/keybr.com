import {
  ensureVisible,
  Icon,
  IconButton,
  type OptionListOption,
  Popup,
  Portal,
} from "@keybr/widget";
import {
  mdiArrowCollapseAll,
  mdiArrowExpandAll,
  mdiFormatFont,
  mdiThemeLightDark,
} from "@mdi/js";
import { clsx } from "clsx";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useTheme } from "./context.ts";
import { COLORS, FONTS } from "./themes.ts";
import * as styles from "./ThemeSwitcher.module.less";

export function ThemeSwitcher() {
  const [open, setOpen] = useState(null as "color" | "font" | null);
  return (
    <div className={styles.root}>
      {open && (
        <Portal>
          <Popup anchor={`.${styles.root}`} arrow={false} position="block-end">
            {open === "color" && (
              <ColorMenu
                onClose={() => {
                  setOpen(null);
                }}
              />
            )}
            {open === "font" && (
              <FontMenu
                onClose={() => {
                  setOpen(null);
                }}
              />
            )}
          </Popup>
        </Portal>
      )}
      <IconButton
        icon={<Icon shape={mdiThemeLightDark} />}
        onClick={() => {
          setOpen("color");
        }}
      />
      <IconButton
        icon={<Icon shape={mdiFormatFont} />}
        onClick={() => {
          setOpen("font");
        }}
      />
      <FullscreenButton />
    </div>
  );
}

function FullscreenButton() {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  switch (theme.fullscreenState) {
    case true:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowCollapseAll} />}
          title={formatMessage(
            defineMessage({
              id: "theme.exitFullscreen.description",
              defaultMessage: "Exit full-screen mode.",
            }),
          )}
          onClick={() => {
            theme.toggleFullscreen();
          }}
        />
      );
    case false:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowExpandAll} />}
          title={formatMessage(
            defineMessage({
              id: "theme.enterFullscreen.description",
              defaultMessage: "Enter full-screen mode.",
            }),
          )}
          onClick={() => {
            theme.toggleFullscreen();
          }}
        />
      );
    default:
      return <IconButton icon={<Icon shape={mdiArrowExpandAll} />} />;
  }
}

function ColorMenu({ onClose }: { readonly onClose: () => void }) {
  const theme = useTheme();
  const options = [...COLORS].map(({ id, name }) => ({ value: id, name }));
  const selected =
    options.find(({ value }) => value === theme.color) ?? options[0];
  return (
    <Menu
      options={options}
      selectedOption={selected}
      onSelect={({ value }) => {
        theme.switchColor(value);
        onClose();
      }}
    />
  );
}

function FontMenu({ onClose }: { readonly onClose: () => void }) {
  const theme = useTheme();
  const options = [...FONTS].map(({ id, name }) => ({ value: id, name }));
  const selected =
    options.find(({ value }) => value === theme.font) ?? options[0];
  return (
    <Menu
      options={options}
      selectedOption={selected}
      onSelect={({ value }) => {
        theme.switchFont(value);
        onClose();
      }}
    />
  );
}

function Menu({
  options,
  selectedOption,
  onSelect,
}: {
  readonly options: readonly OptionListOption[];
  readonly selectedOption: OptionListOption;
  readonly onSelect: (value: OptionListOption) => void;
}): ReactNode {
  const list = useRef(null);
  const item = useRef(null);
  useEffect(() => {
    ensureVisible(list.current, item.current);
  });
  return (
    <ul ref={list} role="menu" className={styles.menu}>
      {options.map((option, index) => (
        <li
          key={index}
          ref={option === selectedOption ? item : null}
          role="menuitem"
          className={clsx(
            styles.item,
            option === selectedOption && styles.item_selected,
          )}
          onClick={(event) => {
            event.preventDefault();
            onSelect(option);
          }}
        >
          {option.name}
        </li>
      ))}
    </ul>
  );
}
