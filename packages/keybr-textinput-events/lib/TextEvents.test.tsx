import { test } from "node:test";
import { type Focusable } from "@keybr/widget";
import { fireEvent, render } from "@testing-library/react";
import { assert } from "chai";
import { useRef } from "react";
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
  assert.isTrue(input instanceof HTMLTextAreaElement);

  assert.strictEqual(document.activeElement, input);
  assert.isTrue(focused);

  fireEvent.click(r.getByText("blur"));

  assert.strictEqual(document.activeElement, document.body);
  assert.isFalse(focused);

  fireEvent.click(r.getByText("focus"));

  assert.strictEqual(document.activeElement, input);
  assert.isTrue(focused);

  fireEvent.click(r.getByText("blur"));

  assert.strictEqual(document.activeElement, document.body);
  assert.isFalse(focused);

  r.unmount();
});

function TestContainer({
  onFocus, //
  onBlur,
}: {
  readonly onFocus: () => void;
  readonly onBlur: () => void;
}) {
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
