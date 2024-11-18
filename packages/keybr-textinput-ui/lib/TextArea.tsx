import { type LineList, type TextDisplaySettings } from "@keybr/textinput";
import {
  type IInputEvent,
  type IKeyboardEvent,
  ModifierState,
  TextEvents,
} from "@keybr/textinput-events";
import {
  type Focusable,
  useHotkeys,
  useWindowEvent,
  type ZoomableProps,
} from "@keybr/widget";
import {
  type BaseSyntheticEvent,
  type ComponentType,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./TextArea.module.less";
import { TextLines, type TextLineSize } from "./TextLines.tsx";

export function TextArea({
  settings,
  lines,
  wrap,
  size,
  lineTemplate,
  demo,
  moving,
  focusRef,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onInput,
}: {
  readonly settings: TextDisplaySettings;
  readonly lines: LineList;
  readonly wrap?: boolean;
  readonly size?: TextLineSize;
  readonly lineTemplate?: ComponentType<any>;
  readonly demo?: boolean;
  readonly moving?: boolean;
  readonly focusRef?: RefObject<Focusable>;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: IKeyboardEvent) => void;
  readonly onKeyUp?: (event: IKeyboardEvent) => void;
  readonly onInput?: (event: IInputEvent) => void;
} & ZoomableProps): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<Focusable>(null);
  useImperativeHandle(focusRef, () => ({
    focus() {
      innerRef.current?.focus();
    },
    blur() {
      innerRef.current?.blur();
    },
  }));
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (element != null) {
      setElementCursor(element, !moving && focus ? "none" : "default");
    }
  });
  useWindowEvent("mousemove", () => {
    const element = ref.current;
    if (element != null) {
      setElementCursor(element, "default");
    }
  });
  useHotkeys({
    ["Enter"]: () => {
      innerRef.current?.focus();
    },
  });
  const handleFocus = useCallback(() => {
    setFocus(true);
    onFocus?.();
  }, [onFocus]);
  const handleBlur = useCallback(() => {
    setFocus(false);
    onBlur?.();
  }, [onBlur]);
  const handleClick = (event: BaseSyntheticEvent): void => {
    innerRef.current?.focus();
    event.preventDefault();
  };
  return (
    <div ref={ref} className={styles.root} onClick={handleClick}>
      <TextEvents
        focusRef={innerRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onInput={onInput}
      />
      <TextLines
        settings={settings}
        lines={lines}
        wrap={wrap}
        size={size}
        lineTemplate={lineTemplate}
        cursor={!demo && focus}
        focus={demo || focus}
      />
      {!demo && focus && ModifierState.capsLock && (
        <div className={styles.messageArea}>
          <div className={styles.messageText}>
            <FormattedMessage
              id="textArea.capsLock.message"
              defaultMessage="Caps Lock is on"
            />
          </div>
        </div>
      )}
      {demo || focus || (
        <div className={styles.messageArea}>
          <div className={styles.messageText}>
            <FormattedMessage
              id="textArea.focus.message"
              defaultMessage="Click or press Enter to activate..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

function setElementCursor(element: HTMLDivElement, cursor: string): void {
  const { style } = element;
  style.cursor = cursor;
}
