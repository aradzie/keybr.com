import { Icon, IconButton } from "@keybr/widget";
import { mdiArrowCollapseAll, mdiArrowExpandAll, mdiFormatSize } from "@mdi/js";
import { type ReactNode } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useTheme } from "./context.tsx";
import { TEXT_SIZES, THEMES } from "./options.tsx";

const enterFullscreenTitle = defineMessage({
  id: "theme.enterFullscreen.description",
  defaultMessage: "Enter full-screen mode.",
});
const exitFullscreenTitle = defineMessage({
  id: "theme.exitFullscreen.description",
  defaultMessage: "Exit full-screen mode.",
});
const fullscreenNotSupportedTitle = defineMessage({
  id: "theme.fullscreenNotSupported.description",
  defaultMessage: "Full-screen mode not supported.",
});
const switchThemeTitle = defineMessage({
  id: "theme.switchTheme.description",
  defaultMessage: "Switch to theme {name}.",
});

export function FullscreenButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  switch (theme.fullscreenState) {
    case true:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowCollapseAll} />}
          title={formatMessage(exitFullscreenTitle)}
          onClick={() => {
            theme.toggleFullscreen();
          }}
        />
      );
    case false:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowExpandAll} />}
          title={formatMessage(enterFullscreenTitle)}
          onClick={() => {
            theme.toggleFullscreen();
          }}
        />
      );
    default:
      return (
        <IconButton
          icon={<Icon shape={mdiArrowExpandAll} />}
          title={formatMessage(fullscreenNotSupportedTitle)}
        />
      );
  }
}

export function ThemeButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = THEMES.findOption(theme.themeName);
  const next = THEMES.findNext(option);
  return (
    <IconButton
      icon={option.icon}
      title={formatMessage(switchThemeTitle, {
        name: next.title,
      })}
      onClick={() => {
        theme.switchTheme(next.id);
      }}
    />
  );
}

export function TextSizeButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = TEXT_SIZES.findOption(theme.textSize);
  const next = TEXT_SIZES.findNext(option);
  return (
    <IconButton
      icon={<Icon shape={mdiFormatSize} />}
      title={formatMessage(switchThemeTitle, {
        name: next.title,
      })}
      onClick={() => {
        theme.switchTextSize(next.id);
      }}
    />
  );
}
