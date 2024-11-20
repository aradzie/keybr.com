import { test } from "node:test";
import { deepEqual, isTrue } from "rich-assert";
import { InputHandler } from "./inputhandler.ts";
import { fakeEvent, type FakeEventInit, tracingListener } from "./testing.ts";

test("handle a normal input", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  // Act.

  replay(
    handler,
    { timeStamp: 100, type: "keydown", code: "KeyA", key: "a" },
    { timeStamp: 100, type: "input", inputType: "insertText", data: "a" },
    { timeStamp: 200, type: "keyup", code: "KeyA", key: "a" },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,KeyA,a", //
    "100,appendChar,a,100",
    "200,keyup,KeyA,a",
  ]);
});

test("handle a composite input", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  // Act.

  replay(
    handler,
    { timeStamp: 100, type: "keydown", code: "AltRight", key: "AltGraph" },
    { timeStamp: 200, type: "keydown", code: "Semicolon", key: "Dead" },
    { timeStamp: 200, type: "compositionstart", data: "" },
    { timeStamp: 200, type: "input", inputType: "insertCompositionText", data: "´" },
    { timeStamp: 200, type: "compositionupdate", data: "´" },
    { timeStamp: 200, type: "input", inputType: "insertCompositionText", data: "´" },
    { timeStamp: 300, type: "keyup", code: "Semicolon", key: "Dead" },
    { timeStamp: 400, type: "keyup", code: "AltRight", key: "AltGraph" },
    { timeStamp: 500, type: "keydown", code: "KeyA", key: "a" },
    { timeStamp: 500, type: "input", inputType: "insertCompositionText", data: "á" },
    { timeStamp: 500, type: "compositionupdate", data: "á" },
    { timeStamp: 500, type: "input", inputType: "insertCompositionText", data: "á" },
    { timeStamp: 500, type: "compositionend", data: "á" },
    { timeStamp: 600, type: "keyup", code: "KeyA", key: "a" },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,AltRight,AltGraph",
    "200,keydown,Semicolon,Dead",
    "300,keyup,Semicolon,Dead",
    "400,keyup,AltRight,AltGraph",
    "500,keydown,KeyA,a",
    "500,appendChar,á,300",
    "600,keyup,KeyA,a",
  ]);
});

test("handle a clear char input", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  // Act.

  replay(
    handler,
    { timeStamp: 100, type: "keydown", code: "Backspace", key: "Backspace" },
    { timeStamp: 100, type: "input", inputType: "deleteContentBackward" },
    { timeStamp: 200, type: "keyup", code: "Backspace", key: "Backspace" },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,Backspace,Backspace",
    "100,clearChar,\u0000,100",
    "200,keyup,Backspace,Backspace",
  ]);
});

test("handle a clear word input", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  // Act.

  replay(
    handler,
    { timeStamp: 100, type: "keydown", code: "ControlLeft", key: "Control" },
    { timeStamp: 200, type: "keydown", code: "Backspace", key: "Backspace", modifiers: ["Control"] },
    { timeStamp: 200, type: "input", inputType: "deleteWordBackward" },
    { timeStamp: 300, type: "keyup", code: "Backspace", key: "Backspace", modifiers: ["Control"] },
    { timeStamp: 400, type: "keyup", code: "ControlLeft", key: "Control" },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,ControlLeft,Control",
    "200,keydown,Backspace,Backspace",
    "200,clearWord,\u0000,200", // We don't count the Control key as a modifier.
    "300,keyup,Backspace,Backspace",
    "400,keyup,ControlLeft,Control",
  ]);
});

test("handle the enter key", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  // Act.

  replay(
    handler,
    { timeStamp: 100, type: "keydown", code: "NumpadEnter", key: "Enter" },
    { timeStamp: 100, type: "input", inputType: "insertLineBreak" },
    { timeStamp: 200, type: "keyup", code: "NumpadEnter", key: "Enter" },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,NumpadEnter,Enter",
    "100,appendLineBreak,\u0000,100",
    "200,keyup,NumpadEnter,Enter",
  ]);
});

test("handle the tab", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  const keyDown = fakeEvent({
    timeStamp: 100,
    type: "keydown",
    code: "Tab",
    key: "Tab",
  });
  const keyUp = fakeEvent({
    timeStamp: 200,
    type: "keyup",
    code: "Tab",
    key: "Tab",
  });

  // Act.

  handler.handleKeyboard(keyDown);
  handler.handleKeyboard(keyUp);

  // Assert.

  isTrue(keyDown.defaultPrevented);
  isTrue(keyUp.defaultPrevented);

  deepEqual(target.trace, [
    "100,keydown,Tab,Tab", //
    "200,keyup,Tab,Tab",
  ]);
});

test("incomplete events", () => {
  // Arrange.

  const target = tracingListener();
  const handler = new InputHandler();
  handler.setCallbacks(target);

  // Act.

  replay(
    handler,
    { timeStamp: 100, type: "keydown", code: "", key: "Unidentified" },
    { timeStamp: 100, type: "input", inputType: "insertText", data: "a" },
    { timeStamp: 200, type: "keyup", code: "", key: "Unidentified" },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,appendChar,a,100", //
  ]);
});

function replay(handler: InputHandler, ...events: FakeEventInit[]) {
  for (const event of events) {
    switch (event.type) {
      case "keydown":
      case "keyup":
        handler.handleKeyboard(fakeEvent(event));
        break;
      case "input":
        handler.handleInput(fakeEvent(event));
        break;
      case "compositionstart":
      case "compositionupdate":
      case "compositionend":
        handler.handleComposition(fakeEvent(event));
    }
  }
}
