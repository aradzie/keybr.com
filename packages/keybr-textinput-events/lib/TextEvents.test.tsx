import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { type ReactNode, useRef } from "react";
import { TextEvents } from "./TextEvents.tsx";
import { type Focusable } from "./types.ts";

test.serial("focus and blur", (t) => {
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

  const input = r.container.querySelector("input") as HTMLInputElement;
  t.true(input instanceof HTMLInputElement);

  t.is(document.activeElement, input);
  t.true(focused);

  fireEvent.click(r.getByText("blur"));

  t.is(document.activeElement, document.body);
  t.false(focused);

  fireEvent.click(r.getByText("focus"));

  t.is(document.activeElement, input);
  t.true(focused);

  fireEvent.click(r.getByText("blur"));

  t.is(document.activeElement, document.body);
  t.false(focused);

  r.unmount();
});

function TestContainer({
  onFocus,
  onBlur,
}: {
  readonly onFocus: () => void;
  readonly onBlur: () => void;
}): ReactNode {
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
