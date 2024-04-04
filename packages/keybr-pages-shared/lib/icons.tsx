import { type ClassName, Icon } from "@keybr/widget";
import {
  mdiAccount,
  mdiAlert,
  mdiCarSide,
  mdiChartAreaspline,
  mdiHelpCircleOutline,
  mdiKeyboard,
  mdiKeyboardOutline,
  mdiSpeedometer,
  mdiTextBoxCheckOutline,
  mdiTrophyOutline,
} from "@mdi/js";
import { type ReactNode } from "react";

type Props = {
  readonly className?: ClassName;
};

export function AccountIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiAccount} className={className} />;
}

export function PracticeIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiKeyboard} className={className} />;
}

export function ProfileIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiChartAreaspline} className={className} />;
}

export function TypingTestIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiSpeedometer} className={className} />;
}

export function HelpIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiHelpCircleOutline} className={className} />;
}

export function HighScoresIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiTrophyOutline} className={className} />;
}

export function MultiplayerIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiCarSide} className={className} />;
}

export function LayoutsIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiKeyboardOutline} className={className} />;
}

export function WordCountIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiTextBoxCheckOutline} className={className} />;
}

export function AlertIcon({ className }: Props): ReactNode {
  return <Icon shape={mdiAlert} className={className} />;
}
