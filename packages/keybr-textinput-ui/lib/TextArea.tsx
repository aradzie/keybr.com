import { type LineList, type TextDisplaySettings } from "@keybr/textinput";
import {
  type KeyEvent,
  TextEvents,
  type TextInputEvent,
} from "@keybr/textinput-events";
import {
  type BaseSyntheticEvent,
  type ComponentType,
  type ReactNode,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";
import * as styles from "./TextArea.module.less";
import { TextLines, type TextLineSize } from "./TextLines.tsx";

export type Focusable = {
  blur(): void;
  focus(): void;
};

export function TextArea({
  settings,
  lines,
  wrap,
  size,
  lineTemplate,
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onTextInput,
  focusRef,
}: {
  readonly settings: TextDisplaySettings;
  readonly lines: LineList;
  readonly wrap?: boolean;
  readonly size?: TextLineSize;
  readonly lineTemplate?: ComponentType<any>;
  readonly onFocus?: () => void;
  readonly onBlur?: () => void;
  readonly onKeyDown?: (event: KeyEvent) => void;
  readonly onKeyUp?: (event: KeyEvent) => void;
  readonly onTextInput?: (event: TextInputEvent) => void;
  readonly focusRef?: RefObject<Focusable>;
}): ReactNode {
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
    event.stopPropagation();
  };
  return (
    <div
      className={styles.textArea}
      onMouseDown={handleClick}
      onMouseUp={handleClick}
    >
      <TextEvents
        focusRef={innerRef}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onTextInput={onTextInput}
      />
      <TextLines
        settings={settings}
        lines={lines}
        wrap={wrap}
        size={size}
        lineTemplate={lineTemplate}
        cursor={focus}
        focus={focus}
      />
      {focus || (
        <div className={styles.label}>
          <FormattedMessage
            id="practice.focusText"
            description="Freeform text."
            defaultMessage="Click to activate..."
          />
        </div>
      )}
    </div>
  );
}
