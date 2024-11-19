import { Dir } from "@keybr/intl";
import { names } from "@keybr/lesson-ui";
import { useSettings } from "@keybr/settings";
import { Button, Icon, IconButton, useView } from "@keybr/widget";
import {
  mdiAspectRatio,
  mdiCog,
  mdiHelpCircleOutline,
  mdiRedo,
  mdiUndo,
} from "@mdi/js";
import { memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { views } from "../views.tsx";
import * as styles from "./Controls.module.less";

export const Controls = memo(function Controls({
  onChangeView,
  onResetLesson,
  onSkipLesson,
  onHelp,
}: {
  readonly onChangeView: () => void;
  readonly onResetLesson: () => void;
  readonly onSkipLesson: () => void;
  readonly onHelp: () => void;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { settings } = useSettings();
  const { setView } = useView(views);
  return (
    <div id={names.controls} className={styles.controls}>
      <IconButton
        icon={<Icon shape={mdiHelpCircleOutline} />}
        title={formatMessage({
          id: "practice.widget.showTour.description",
          defaultMessage: "Show a guided tour with help slides.",
        })}
        onClick={onHelp}
      />
      <Dir swap="icon">
        <IconButton
          icon={<Icon shape={mdiUndo} />}
          title={formatMessage({
            id: "practice.widget.resetLesson.description",
            defaultMessage: "Reset the current lesson (Ctrl + Left Arrow).",
          })}
          onClick={onResetLesson}
        />
        <IconButton
          icon={<Icon shape={mdiRedo} />}
          title={formatMessage({
            id: "practice.widget.skipLesson.description",
            defaultMessage: "Skip the current lesson (Ctrl + Right Arrow).",
          })}
          onClick={onSkipLesson}
        />
      </Dir>
      <IconButton
        icon={<Icon shape={mdiAspectRatio} />}
        title={formatMessage({
          id: "practice.widget.switchView.description",
          defaultMessage: "Switch the current interface layout.",
        })}
        onClick={onChangeView}
      />
      {settings.isNew ? (
        <Button
          icon={<Icon shape={mdiCog} />}
          label={formatMessage({
            id: "practice.widget.settings.name",
            defaultMessage: "Settings...",
          })}
          title={formatMessage({
            id: "practice.widget.settings.description",
            defaultMessage:
              "Change lesson settings, configure language, keyboard layout, etc.",
          })}
          onClick={() => {
            setView("settings");
          }}
        />
      ) : (
        <IconButton
          icon={<Icon shape={mdiCog} />}
          title={formatMessage({
            id: "practice.widget.settings.description",
            defaultMessage:
              "Change lesson settings, configure language, keyboard layout, etc.",
          })}
          onClick={() => {
            setView("settings");
          }}
        />
      )}
    </div>
  );
});
