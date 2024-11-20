import { test } from "node:test";
import { type Focusable } from "@keybr/widget";
import { fireEvent, render } from "@testing-library/react";
import { useRef } from "react";
import { equal, isFalse, isTrue } from "rich-assert";
import { TextEvents } from "./TextEvents.tsx";

test("focus and blur", () => {
  let focused = false;

  const r = render(
    <TestContainer
      onFocus={() => {
        focused = true;
      }}
      onBlur={() => {
        focused = false;
      }}
    />,
  );

  const input = r.container.querySelector("textarea") as HTMLTextAreaElement;
  isTrue(input instanceof HTMLTextAreaElement);

  equal(document.activeElement, input);
  isTrue(focused);

  fireEvent.click(r.getByText("blur"));

  equal(document.activeElement, document.body);
  isFalse(focused);

  fireEvent.click(r.getByText("focus"));

  equal(document.activeElement, input);
  isTrue(focused);

  fireEvent.click(r.getByText("blur"));

  equal(document.activeElement, document.body);
  isFalse(focused);

  r.unmount();
});

function TestContainer({ onFocus, onBlur }: { onFocus: () => void; onBlur: () => void }) {
  const ref = useRef<Focusable>(null);
  return (
    <div>
      <TextEvents focusRef={ref} onFocus={onFocus} onBlur={onBlur} />
      <button
        onClick={() => {
          ref.current?.focus();
        }}
      >
        focus
      </button>
      <button
        onClick={() => {
          ref.current?.blur();
        }}
      >
        blur
      </button>
    </div>
  );
}
