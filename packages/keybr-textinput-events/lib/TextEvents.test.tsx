import { fireEvent, render } from "@testing-library/react";
import test from "ava";
import { type ReactNode, useRef } from "react";
import {
  newFakeCompositionEvent,
  newFakeInputEvent,
  newFakeKeyboardEvent,
  tracingListener,
} from "./testing/fakes.ts";
import { TextEvents } from "./TextEvents.tsx";

test.serial("handle a normal key press", (t) => {
  const trace: string[] = [];
  const listener = tracingListener(trace);
  const events = new TextEvents(listener) as any;

  events.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "KeyA",
      key: "a",
    }),
  );
  events.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 1.123,
      inputType: "insertText",
      data: "a",
    }),
  );
  events.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "KeyA",
      key: "a",
    }),
  );

  t.deepEqual(trace, ["keydown:KeyA,a,1", "input:a,1", "keyup:KeyA,a,2"]);
});

test.serial("handle a composite key press", (t) => {
  const trace: string[] = [];
  const listener = tracingListener(trace);
  const events = new TextEvents(listener) as any;

  events.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "KeyA",
      key: "a",
    }),
  );
  events.handleComposition(
    newFakeCompositionEvent({
      type: "compositionstart",
      timeStamp: 2.123,
      data: "",
    }),
  );
  events.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 3.123,
      inputType: "insertText",
      data: "a",
    }),
  );
  events.handleComposition(
    newFakeCompositionEvent({
      type: "compositionend",
      timeStamp: 4.123,
      data: "ä",
    }),
  );
  events.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 5.123,
      code: "KeyA",
      key: "a",
    }),
  );

  t.deepEqual(trace, ["keydown:KeyA,a,1", "input:ä,4", "keyup:KeyA,a,5"]);
});

test.serial("handle a special key press without modifiers", (t) => {
  const trace: string[] = [];
  const listener = tracingListener(trace);
  const events = new TextEvents(listener) as any;

  let keyDown: any;
  let keyUp: any;

  events.handleKeyDown(
    (keyDown = newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Backspace",
      key: "Backspace",
    })),
  );
  events.handleKeyUp(
    (keyUp = newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "Backspace",
      key: "Backspace",
    })),
  );

  t.true(keyDown.defaultPrevented);
  t.false(keyUp.defaultPrevented);

  t.deepEqual(trace, [
    "keydown:Backspace,Backspace,1",
    "input:\u0008,1",
    "keyup:Backspace,Backspace,2",
  ]);
});

test.serial("handle a special key press with modifiers", (t) => {
  const trace: string[] = [];
  const listener = tracingListener(trace);
  const events = new TextEvents(listener) as any;

  let keyDown: any;
  let keyUp: any;

  events.handleKeyDown(
    (keyDown = newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    })),
  );
  events.handleKeyUp(
    (keyUp = newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    })),
  );

  t.false(keyDown.defaultPrevented);
  t.false(keyUp.defaultPrevented);

  t.deepEqual(trace, ["keydown:Tab,Tab,1", "keyup:Tab,Tab,2"]);
});

test.serial("focus and blur", (t) => {
  let focused = false;

  const r = render(
    <Container
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

function Container({
  onFocus,
  onBlur,
}: {
  readonly onFocus: () => void;
  readonly onBlur: () => void;
}): ReactNode {
  const ref = useRef<TextEvents>(null);
  return (
    <div>
      <TextEvents ref={ref} onFocus={onFocus} onBlur={onBlur} />
      <button
        onClick={() => {
          const { current } = ref;
          if (current != null) {
            current.focus();
          }
        }}
      >
        focus
      </button>
      <button
        onClick={() => {
          const { current } = ref;
          if (current != null) {
            current.blur();
          }
        }}
      >
        blur
      </button>
    </div>
  );
}
