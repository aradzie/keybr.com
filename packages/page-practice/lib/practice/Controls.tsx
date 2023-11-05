import { Button, Icon, IconButton, stylePositionTopRight } from "@keybr/widget";
import {
  mdiAspectRatio,
  mdiCog,
  mdiHelpCircleOutline,
  mdiRedo,
  mdiUndo,
} from "@mdi/js";
import { memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import * as names from "./names.module.less";

export const Controls = memo(function Controls({
  onChangeView,
  onResetLesson,
  onSkipLesson,
  onHelp,
  onConfigure,
}: {
  readonly onChangeView: () => void;
  readonly onResetLesson: () => void;
  readonly onSkipLesson: () => void;
  readonly onHelp: () => void;
  readonly onConfigure: () => void;
}): ReactNode {
  const { formatMessage } = useIntl();
  return (
    <div id={names.controls} className={stylePositionTopRight}>
      <IconButton
        onClick={onHelp}
        icon={<Icon shape={mdiHelpCircleOutline} />}
        title={formatMessage({
          id: "practice.widget.showTour.description",
          description: "Widget description.",
          defaultMessage: "Show a guided tour with help slides.",
        })}
      />
      <IconButton
        onClick={onResetLesson}
        icon={<Icon shape={mdiUndo} />}
        title={formatMessage({
          id: "practice.widget.resetLesson.description",
          description: "Widget description.",
          defaultMessage: "Reset the current lesson (Ctrl + Left Arrow).",
        })}
      />
      <IconButton
        onClick={onSkipLesson}
        icon={<Icon shape={mdiRedo} />}
        title={formatMessage({
          id: "practice.widget.skipLesson.description",
          description: "Widget description.",
          defaultMessage: "Skip the current lesson (Ctrl + Right Arrow).",
        })}
      />
      <IconButton
        onClick={onChangeView}
        icon={<Icon shape={mdiAspectRatio} />}
        title={formatMessage({
          id: "practice.widget.switchView.description",
          description: "Widget description.",
          defaultMessage: "Switch the current interface layout.",
        })}
      />
      <Button
        icon={<Icon shape={mdiCog} />}
        label={formatMessage({
          id: "practice.widget.settings.name",
          description: "Widget name.",
          defaultMessage: "Settings...",
        })}
        title={formatMessage({
          id: "practice.widget.settings.description",
          description: "Widget description.",
          defaultMessage:
            "Change lesson settings, configure language, keyboard layout, etc.",
        })}
        onClick={onConfigure}
      />
    </div>
  );
});
