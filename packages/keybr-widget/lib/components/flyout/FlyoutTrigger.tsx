import { cloneElement, isValidElement, type ReactElement } from "react";
import {
  type AnchorProps,
  type FocusProps,
  type MouseProps,
} from "../types.ts";
import { useFlyout } from "./Flyout.context.ts";

type TriggerElement = ReactElement<FocusProps & MouseProps & AnchorProps>;

type TriggerElementCallback = (
  props: {
    readonly open: boolean;
    readonly setOpen: (open: boolean) => void;
  } & FocusProps &
    MouseProps &
    AnchorProps,
) => ReactElement;

export type FlyoutTriggerProps = {
  readonly children: TriggerElement | TriggerElementCallback;
};

export function FlyoutTrigger({ children }: FlyoutTriggerProps): ReactElement {
  const { anchorRef, open, setOpen } = useFlyout();
  if (isValidElement(children)) {
    const { props } = children;
    return cloneElement(children, {
      ...props,
      anchor: anchorRef,
      onClick: (ev) => {
        props.onClick?.(ev);
        setOpen(!open);
      },
      onFocus: (ev) => {
        props.onFocus?.(ev);
      },
      onBlur: (ev) => {
        props.onBlur?.(ev);
      },
    });
  } else {
    return children({
      anchor: anchorRef,
      open,
      setOpen,
      onClick: () => {
        setOpen(!open);
      },
    });
  }
}
