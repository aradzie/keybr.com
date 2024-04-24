import { Icon, IconButton } from "@keybr/widget";
import { mdiArrowCollapseAll, mdiArrowExpandAll, mdiFormatFont } from "@mdi/js";
import { type ReactNode } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useTheme } from "./context.tsx";
import { COLORS, FONTS } from "./options.tsx";
import * as styles from "./ThemeSwitcher.module.less";

export function ThemeSwitcher(): ReactNode {
  return (
    <div className={styles.themeSwitcher}>
      <ColorButton />
      <FontButton />
      <FullscreenButton />
    </div>
  );
}

ThemeSwitcher.selector = `.${styles.themeSwitcher}`;

function FullscreenButton(): ReactNode {
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

function ColorButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = COLORS.findOption(theme.color);
  const next = COLORS.findNext(option);
  return (
    <IconButton
      icon={option.icon}
      title={formatMessage(
        defineMessage({
          id: "theme.switchTheme.description",
          defaultMessage: "Switch to theme {name}.",
        }),
        {
          name: next.title,
        },
      )}
      onClick={() => {
        theme.switchColor(next.id);
      }}
    />
  );
}

function FontButton(): ReactNode {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const option = FONTS.findOption(theme.font);
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
          name: next.title,
        },
      )}
      onClick={() => {
        theme.switchFont(next.id);
      }}
    />
  );
}
