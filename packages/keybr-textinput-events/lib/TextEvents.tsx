import { type Focusable } from "@keybr/widget";
import {
  type CSSProperties,
  memo,
  type ReactNode,
  type RefObject,
  useImperativeHandle,
  useRef,
} from "react";
import { InputHandler, type Listeners } from "./inputhandler.ts";

export const TextEvents = memo(function TextEvents({
  onFocus,
  onBlur,
  onKeyDown,
  onKeyUp,
  onTextInput,
  focusRef,
}: Listeners & {
  readonly focusRef?: RefObject<Focusable>;
}): ReactNode {
  const handler = useInputHandler();
  useImperativeHandle(focusRef, () => handler);
  handler.setListeners({ onFocus, onBlur, onKeyDown, onKeyUp, onTextInput });
  return (
    <div style={divStyle}>
      <textarea
        ref={handler.setInput}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        style={inputStyle}
      />
    </div>
  );
});

function useInputHandler(): InputHandler {
  const handlerRef = useRef<InputHandler | null>(null);
  let handler = handlerRef.current;
  if (handler == null) {
    handlerRef.current = handler = new InputHandler();
  }
  return handler;
}

const divStyle: CSSProperties = {
  position: "absolute",
  insetInlineStart: "0px",
  insetBlockStart: "0px",
  inlineSize: "0px",
  blockSize: "0px",
  overflow: "hidden",
};

const inputStyle: CSSProperties = {
  display: "block",
  margin: "0px",
  padding: "0px",
  inlineSize: "1em",
  blockSize: "1em",
  border: "none",
  outline: "none",
};
