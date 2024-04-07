import { Icon, IconButton } from "@keybr/widget";
import { mdiArrowCollapseAll, mdiArrowExpandAll, mdiFormatFont } from "@mdi/js";
import { type ReactNode } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useTheme } from "./context.tsx";
import { COLORS, FONTS } from "./options.tsx";

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

export function ColorButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = COLORS.findOption(theme.color);
  const next = COLORS.findNext(option);
  return (
    <IconButton
      icon={option.icon}
      title={formatMessage(switchThemeTitle, {
        name: next.title,
      })}
      onClick={() => {
        theme.switchColor(next.id);
      }}
    />
  );
}

export function FontButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = FONTS.findOption(theme.font);
  const next = FONTS.findNext(option);
  return (
    <IconButton
      icon={<Icon shape={mdiFormatFont} />}
      title={formatMessage(switchThemeTitle, {
        name: next.title,
      })}
      onClick={() => {
        theme.switchFont(next.id);
      }}
    />
  );
}
