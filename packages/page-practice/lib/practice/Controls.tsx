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
          id: "practice.showHelpSlidesButtonTitle",
          description: "Input field title.",
          defaultMessage: "Show a guided tour with help slides.",
        })}
      />
      <IconButton
        onClick={onResetLesson}
        icon={<Icon shape={mdiUndo} />}
        title={formatMessage({
          id: "practice.resetLessonButtonTitle",
          description: "Input field title.",
          defaultMessage: "Reset the current lesson (Ctrl + Left Arrow).",
        })}
      />
      <IconButton
        onClick={onSkipLesson}
        icon={<Icon shape={mdiRedo} />}
        title={formatMessage({
          id: "practice.skipLessonButtonTitle",
          description: "Input field title.",
          defaultMessage: "Skip the current lesson (Ctrl + Right Arrow).",
        })}
      />
      <IconButton
        onClick={onChangeView}
        icon={<Icon shape={mdiAspectRatio} />}
        title={formatMessage({
          id: "practice.switchInterfaceButtonTitle",
          description: "Input field title.",
          defaultMessage: "Switch the current interface layout.",
        })}
      />
      <Button
        icon={<Icon shape={mdiCog} />}
        label={formatMessage({
          id: "practice.settingButtonName",
          description: "Input field label.",
          defaultMessage: "Settings...",
        })}
        title={formatMessage({
          id: "practice.settingButtonTitle",
          description: "Input field title.",
          defaultMessage:
            "Change lesson settings, configure language, keyboard layout, etc.",
        })}
        onClick={onConfigure}
      />
    </div>
  );
});
