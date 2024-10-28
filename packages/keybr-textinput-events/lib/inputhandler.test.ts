import test from "ava";
import { InputHandler } from "./inputhandler.ts";
import {
  fakeCompositionEvent,
  fakeInputEvent,
  fakeKeyboardEvent,
  tracingListener,
} from "./testing/fakes.ts";

test("handle a normal input", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  // Act.

  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 100,
      type: "keydown",
      code: "KeyA",
      key: "a",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 100,
      type: "input",
      inputType: "insertText",
      data: "a",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 200,
      type: "keyup",
      code: "KeyA",
      key: "a",
    }),
  );

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,KeyA,a",
    "100,appendChar,a,100",
    "200,keyup,KeyA,a",
  ]);
});

test("handle a composite input", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  // Act.

  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 100,
      type: "keydown",
      code: "AltRight",
      key: "AltGraph",
    }),
  );
  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 200,
      type: "keydown",
      code: "Semicolon",
      key: "Dead",
    }),
  );
  handler.handleComposition(
    fakeCompositionEvent({
      timeStamp: 200,
      type: "compositionstart",
      data: "",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 200,
      type: "input",
      inputType: "insertCompositionText",
      data: "´",
    }),
  );
  handler.handleComposition(
    fakeCompositionEvent({
      timeStamp: 200,
      type: "compositionupdate",
      data: "´",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 200,
      type: "input",
      inputType: "insertCompositionText",
      data: "´",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 300,
      type: "keyup",
      code: "Semicolon",
      key: "Dead",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 400,
      type: "keyup",
      code: "AltRight",
      key: "AltGraph",
    }),
  );
  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 500,
      type: "keydown",
      code: "KeyA",
      key: "a",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 500,
      type: "input",
      inputType: "insertCompositionText",
      data: "á",
    }),
  );
  handler.handleComposition(
    fakeCompositionEvent({
      timeStamp: 500,
      type: "compositionupdate",
      data: "á",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 500,
      type: "input",
      inputType: "insertCompositionText",
      data: "á",
    }),
  );
  handler.handleComposition(
    fakeCompositionEvent({
      timeStamp: 500,
      type: "compositionend",
      data: "á",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 600,
      type: "keyup",
      code: "KeyA",
      key: "a",
    }),
  );

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,AltRight,AltGraph",
    "200,keydown,Semicolon,Dead",
    "300,keyup,Semicolon,Dead",
    "400,keyup,AltRight,AltGraph",
    "500,keydown,KeyA,a",
    "500,appendChar,á,300",
    "600,keyup,KeyA,a",
  ]);
});

test("handle a clear char input", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  // Act.

  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 100,
      type: "keydown",
      code: "Backspace",
      key: "Backspace",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 100,
      type: "input",
      inputType: "deleteContentBackward",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 200,
      type: "keyup",
      code: "Backspace",
      key: "Backspace",
    }),
  );

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,Backspace,Backspace",
    "100,clearChar,\u0000,100",
    "200,keyup,Backspace,Backspace",
  ]);
});

test("handle a clear word input", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  // Act.

  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 100,
      type: "keydown",
      code: "Backspace",
      key: "Backspace",
      modifiers: ["Control"],
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 100,
      type: "input",
      inputType: "deleteWordBackward",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 200,
      type: "keyup",
      code: "Backspace",
      key: "Backspace",
      modifiers: ["Control"],
    }),
  );

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,Backspace,Backspace",
    "100,clearWord,\u0000,100",
    "200,keyup,Backspace,Backspace",
  ]);
});

test("handle the enter key", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  // Act.

  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 100,
      type: "keydown",
      code: "NumpadEnter",
      key: "Enter",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 100,
      type: "input",
      inputType: "insertLineBreak",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 200,
      type: "keyup",
      code: "NumpadEnter",
      key: "Enter",
    }),
  );

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,NumpadEnter,Enter",
    "100,appendLineBreak,\u0000,100",
    "200,keyup,NumpadEnter,Enter",
  ]);
});

test("handle the tab", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  const keyDown = fakeKeyboardEvent({
    timeStamp: 100,
    type: "keydown",
    code: "Tab",
    key: "Tab",
  });
  const keyUp = fakeKeyboardEvent({
    timeStamp: 200,
    type: "keyup",
    code: "Tab",
    key: "Tab",
  });

  // Act.

  handler.handleKeyDown(keyDown);
  handler.handleKeyUp(keyUp);

  // Assert.

  t.true(keyDown.defaultPrevented);
  t.false(keyUp.defaultPrevented);

  t.deepEqual(target.trace, ["100,keydown,Tab,Tab", "200,keyup,Tab,Tab"]);
});

test("incomplete events", (t) => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setListeners(target);

  // Act.

  handler.handleKeyDown(
    fakeKeyboardEvent({
      timeStamp: 100,
      type: "keydown",
      code: "",
      key: "Undefined",
    }),
  );
  handler.handleInput(
    fakeInputEvent({
      timeStamp: 100,
      type: "input",
      inputType: "insertText",
      data: "a",
    }),
  );
  handler.handleKeyUp(
    fakeKeyboardEvent({
      timeStamp: 200,
      type: "keyup",
      code: "",
      key: "Undefined",
    }),
  );

  // Assert.

  t.deepEqual(target.trace, ["100,appendChar,a,100"]);
});
