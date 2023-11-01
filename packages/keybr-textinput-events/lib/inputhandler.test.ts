import test from "ava";
import { InputHandler } from "./inputhandler.ts";
import {
  newFakeCompositionEvent,
  newFakeInputEvent,
  newFakeKeyboardEvent,
  tracingListener,
} from "./testing/fakes.ts";

test("handle a normal input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  // Act.

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

  // Assert.

  t.deepEqual(trace, ["keydown:KeyA,a,1", "appendChar:a,1", "keyup:KeyA,a,2"]);
});

test("handle a composite input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  // Act.

  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "AltRight",
      key: "AltGraph",
    }),
  );
  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 2.123,
      code: "Semicolon",
      key: "Dead",
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
      timeStamp: 2.123,
      inputType: "insertCompositionText",
      data: "´",
    }),
  );
  handler.handleComposition(
    newFakeCompositionEvent({
      type: "compositionupdate",
      timeStamp: 2.123,
      data: "´",
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 2.123,
      inputType: "insertCompositionText",
      data: "´",
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 3.123,
      code: "Semicolon",
      key: "Dead",
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 4.123,
      code: "AltRight",
      key: "AltGraph",
    }),
  );
  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 5.123,
      code: "KeyA",
      key: "a",
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 5.123,
      inputType: "insertCompositionText",
      data: "á",
    }),
  );
  handler.handleComposition(
    newFakeCompositionEvent({
      type: "compositionupdate",
      timeStamp: 5.123,
      data: "á",
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      timeStamp: 5.123,
      inputType: "insertCompositionText",
      data: "á",
    }),
  );
  handler.handleComposition(
    newFakeCompositionEvent({
      type: "compositionend",
      timeStamp: 5.123,
      data: "á",
    }),
  );
  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 6.123,
      code: "KeyA",
      key: "a",
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:AltRight,AltGraph,1",
    "keydown:Semicolon,Dead,2",
    "keyup:Semicolon,Dead,3",
    "keyup:AltRight,AltGraph,4",
    "keydown:KeyA,a,5",
    "appendChar:á,5",
    "keydown:KeyA,a,6",
  ]);
});

test("handle a clear char input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  // Act.

  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: false,
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      inputType: "deleteContentBackward",
      timeStamp: 1.123,
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: false,
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:Backspace,Backspace,1",
    "clearChar:\u0000,1",
    "keyup:Backspace,Backspace,2",
  ]);
});

test("handle a clear word input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  // Act.

  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      inputType: "deleteWordBackward",
      timeStamp: 1.123,
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:Backspace,Backspace,1",
    "clearWord:\u0000,1",
    "keyup:Backspace,Backspace,2",
  ]);
});

test("handle the enter key", (t) => {
  // Arrange.

  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  // Act.

  handler.handleKeyDown(
    newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "NumpadEnter",
      key: "Enter",
    }),
  );
  handler.handleInput(
    newFakeInputEvent({
      type: "input",
      inputType: "insertLineBreak",
      timeStamp: 1.123,
    }),
  );
  handler.handleKeyUp(
    newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "NumpadEnter",
      key: "Enter",
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:NumpadEnter,Enter,1",
    "appendChar: ,1",
    "keyup:NumpadEnter,Enter,2",
  ]);
});

test("handle the tab", (t) => {
  // Arrange.

  const trace: string[] = [];
  const handler = tracingInputHandler(trace);

  let keyDown: any;
  let keyUp: any;

  // Act.

  handler.handleKeyDown(
    (keyDown = newFakeKeyboardEvent({
      type: "keydown",
      timeStamp: 1.123,
      code: "Tab",
      key: "Tab",
    })),
  );
  handler.handleKeyUp(
    (keyUp = newFakeKeyboardEvent({
      type: "keyup",
      timeStamp: 2.123,
      code: "Tab",
      key: "Tab",
    })),
  );

  // Assert.

  t.true(keyDown.defaultPrevented);
  t.false(keyUp.defaultPrevented);

  t.deepEqual(trace, ["keydown:Tab,Tab,1", "keyup:Tab,Tab,2"]);
});

function tracingInputHandler(trace: string[]): any {
  const handler = new InputHandler();
  handler.setListeners(tracingListener(trace));
  return handler;
}
