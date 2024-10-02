import { Icon, IconButton } from "@keybr/widget";
import {
  mdiArrowCollapseAll,
  mdiArrowExpandAll,
  mdiFormatFont,
  mdiThemeLightDark,
} from "@mdi/js";
import { defineMessage, useIntl } from "react-intl";
import { useTheme } from "./context.ts";
import { COLORS, FONTS } from "./themes.ts";
import * as styles from "./ThemeSwitcher.module.less";

export function ThemeSwitcher() {
  return (
    <div className={styles.root}>
      <ColorButton />
      <FontButton />
      <FullscreenButton />
    </div>
  );
}

function ColorButton() {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = COLORS.find(theme.color);
  const next = COLORS.findNext(option);
  return (
    <IconButton
      icon={<Icon shape={mdiThemeLightDark} />}
      title={formatMessage(
        defineMessage({
          id: "theme.switchTheme.description",
          defaultMessage: "Switch to theme {name}.",
        }),
        {
          name: next.name,
        },
      )}
      onClick={() => {
        theme.switchColor(next.id);
      }}
    />
  );
}

function FontButton() {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = FONTS.find(theme.font);
  const next = FONTS.findNext(option);
  return (
    <IconButton
      icon={<Icon shape={mdiFormatFont} />}
      title={formatMessage(
        defineMessage({
          id: "theme.switchTheme.description",
          defaultMessage: "Switch to theme {name}.",
        }),
        {
          name: next.name,
        },
      )}
      onClick={() => {
        theme.switchFont(next.id);
      }}
    />
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
      return (
        <IconButton
          icon={<Icon shape={mdiArrowExpandAll} />}
          title={formatMessage(
            defineMessage({
              id: "theme.fullscreenNotSupported.description",
              defaultMessage: "Full-screen mode not supported.",
            }),
          )}
        />
      );
  }
}
