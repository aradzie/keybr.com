import { COLORS, FONTS, useTheme } from "@keybr/themes";
import {
  Dialog,
  Flyout,
  Icon,
  IconButton,
  OptionListMenu,
} from "@keybr/widget";
import {
  mdiArrowCollapseAll,
  mdiArrowExpandAll,
  mdiFormatFont,
  mdiThemeLightDark,
} from "@mdi/js";
import { lazy, Suspense, useState } from "react";
import { defineMessage, useIntl } from "react-intl";
import * as styles from "./ThemeSwitcher.module.less";

const LazyThemeDesigner = lazy(() => import("./LazyThemeDesigner.tsx"));

export function ThemeSwitcher() {
  const theme = useTheme();
  const [design, setDesign] = useState(false);
  return (
    <div className={styles.root}>
      {design && (
        <Dialog
          onClose={() => {
            setDesign(false);
          }}
        >
          <Suspense>
            <LazyThemeDesigner />
          </Suspense>
        </Dialog>
      )}
      <ColorButton
        {...theme}
        switchColor={(id) => {
          theme.switchColor(id);
          if (id === "custom") {
            setDesign(true);
          }
        }}
      />
      <FontButton
        {...theme}
        switchFont={(id) => {
          theme.switchFont(id);
        }}
      />
      <FullscreenButton {...theme} />
    </div>
  );
}

function ColorButton({
  color,
  switchColor,
}: {
  color: string;
  switchColor: (id: string) => void;
}) {
  return (
    <Flyout>
      <Flyout.Trigger>
        <IconButton icon={<Icon shape={mdiThemeLightDark} />} />
      </Flyout.Trigger>
      <Flyout.Content offset={10}>
        <ColorMenu selectedId={color} onSelect={switchColor} />
      </Flyout.Content>
    </Flyout>
  );
}

function ColorMenu({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const options = [...COLORS].map(({ id, name }) => ({ value: id, name }));
  const selected = options.find(({ value }) => value === selectedId);
  return (
    <OptionListMenu
      options={options}
      selectedOption={selected ?? options[0]}
      onSelect={({ value }) => {
        onSelect(value);
      }}
    />
  );
}

function FontButton({
  font,
  switchFont,
}: {
  font: string;
  switchFont: (id: string) => void;
}) {
  return (
    <Flyout>
      <Flyout.Trigger>
        <IconButton icon={<Icon shape={mdiFormatFont} />} />
      </Flyout.Trigger>
      <Flyout.Content offset={10}>
        <FontMenu selectedId={font} onSelect={switchFont} />
      </Flyout.Content>
    </Flyout>
  );
}

function FontMenu({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const options = [...FONTS].map(({ id, name }) => ({ value: id, name }));
  const selected = options.find(({ value }) => value === selectedId);
  return (
    <OptionListMenu
      options={options}
      selectedOption={selected ?? options[0]}
      onSelect={({ value }) => {
        onSelect(value);
      }}
    />
  );
}

function FullscreenButton({
  fullscreenState,
  toggleFullscreen,
}: {
  fullscreenState: boolean | null;
  toggleFullscreen: () => void;
}) {
  const { formatMessage } = useIntl();
  switch (fullscreenState) {
    case true:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowCollapseAll} />}
          title={formatMessage(
            defineMessage({
              id: "t_theme_Exit_fullscreen_",
              defaultMessage: "Exit full-screen mode.",
            }),
          )}
          onClick={() => {
            toggleFullscreen();
          }}
        />
      );
    case false:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowExpandAll} />}
          title={formatMessage(
            defineMessage({
              id: "t_theme_Enter_fullscreen_",
              defaultMessage: "Enter full-screen mode.",
            }),
          )}
          onClick={() => {
            toggleFullscreen();
          }}
        />
      );
    default:
      return <IconButton icon={<Icon shape={mdiArrowExpandAll} />} />;
  }
}
