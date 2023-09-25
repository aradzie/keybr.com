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
  onLayout,
  onReset,
  onSkip,
  onHelp,
  onConfigure,
}: {
  readonly onLayout: () => void;
  readonly onReset: () => void;
  readonly onSkip: () => void;
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
          description: "Button title.",
          defaultMessage: "Show a guided tour with help slides.",
        })}
      />
      <IconButton
        onClick={onReset}
        icon={<Icon shape={mdiUndo} />}
        title={formatMessage({
          id: "practice.resetLessonButtonTitle",
          description: "Button title.",
          defaultMessage: "Reset the current lesson (Ctrl + Left Arrow).",
        })}
      />
      <IconButton
        onClick={onSkip}
        icon={<Icon shape={mdiRedo} />}
        title={formatMessage({
          id: "practice.skipLessonButtonTitle",
          description: "Button title.",
          defaultMessage: "Skip the current lesson (Ctrl + Right Arrow).",
        })}
      />
      <IconButton
        onClick={onLayout}
        icon={<Icon shape={mdiAspectRatio} />}
        title={formatMessage({
          id: "practice.switchInterfaceButtonTitle",
          description: "Button title.",
          defaultMessage: "Switch the current interface layout.",
        })}
      />
      <Button
        icon={<Icon shape={mdiCog} />}
        label={formatMessage({
          id: "practice.settingButtonName",
          description: "Button name.",
          defaultMessage: "Settings...",
        })}
        title={formatMessage({
          id: "practice.settingButtonTitle",
          description: "Button title.",
          defaultMessage:
            "Change lesson settings, configure language, keyboard layout, etc.",
        })}
        onClick={onConfigure}
      />
    </div>
  );
});
