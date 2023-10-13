import test from "ava";
import { InputHandler } from "./inputhandler.ts";
import {
  newFakeCompositionEvent,
  newFakeInputEvent,
  newFakeKeyboardEvent,
  tracingListener,
} from "./testing/fakes.ts";

test("handle a normal key press", (t) => {
  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "KeyA",
      key: "a",
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 1.123,
      inputType: "insertText",
      data: "a",
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "KeyA",
      key: "a",
    }),
  );

  t.deepEqual(trace, ["keydown:KeyA,a,1", "input:a,1", "keyup:KeyA,a,2"]);
});

test("handle a composite key press", (t) => {
  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "KeyA",
      key: "a",
    }),
  );
  handler.handleComposition(
    newFakeCompositionEvent({
      type: "compositionstart",
      timeStamp: 2.123,
      data: "",
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 3.123,
      inputType: "insertText",
      data: "a",
    }),
  );
  handler.handleComposition(
    newFakeCompositionEvent({
      type: "compositionend",
      timeStamp: 4.123,
      data: "ä",
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 5.123,
      code: "KeyA",
      key: "a",
    }),
  );

  t.deepEqual(trace, ["keydown:KeyA,a,1", "input:ä,4", "keyup:KeyA,a,5"]);
});

test("handle a special key press without modifiers", (t) => {
  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  let keyDown: any;
  let keyUp: any;

  handler.handleKeyDown(
    (keyDown = newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Backspace",
      key: "Backspace",
    })),
  );
  handler.handleKeyUp(
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

test("handle a special key press with modifiers", (t) => {
  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  let keyDown: any;
  let keyUp: any;

  handler.handleKeyDown(
    (keyDown = newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    })),
  );
  handler.handleKeyUp(
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

function tracingInputHandler(trace: string[]): any {
  const handler = new InputHandler();
  handler.setListeners(tracingListener(trace));
  return handler;
}
