import { test } from "node:test";
import { Emulation, keyboardProps, Layout, loadKeyboard } from "@keybr/keyboard";
import { Settings } from "@keybr/settings";
import { deepEqual } from "rich-assert";
import { emulateLayout } from "./emulation.ts";
import { tracingListener } from "./testing.ts";
import { type IInputEvent, type IKeyboardEvent, type InputListener } from "./types.ts";

test("forward emulation, translate a character input", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "ControlLeft", key: "Control", modifiers: [] },
    { timeStamp: 200, type: "keydown", code: "KeyS", key: "s", modifiers: ["Control"] },
    { timeStamp: 300, type: "keyup", code: "KeyS", key: "s", modifiers: ["Control"] },
    { timeStamp: 400, type: "keyup", code: "ControlLeft", key: "Control", modifiers: [] },
    { timeStamp: 500, type: "keydown", code: "ShiftLeft", key: "Shift", modifiers: [] },
    { timeStamp: 600, type: "keydown", code: "KeyS", key: "S", modifiers: ["Shift"] },
    { timeStamp: 600, type: "input", inputType: "appendChar", codePoint: /* "S" */ 0x0053, timeToType: 999 },
    { timeStamp: 700, type: "keyup", code: "KeyS", key: "S", modifiers: ["Shift"] },
    { timeStamp: 800, type: "keyup", code: "ShiftLeft", key: "Shift", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,ControlLeft,Control",
    "200,keydown,KeyS,o",
    "300,keyup,KeyS,o",
    "400,keyup,ControlLeft,Control",
    "500,keydown,ShiftLeft,Shift",
    "600,keydown,KeyS,O",
    "600,appendChar,O,300",
    "700,keyup,KeyS,O",
    "800,keyup,ShiftLeft,Shift",
  ]);
});

test("forward emulation, translate a clear char input", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "Backspace", key: "Backspace", modifiers: [] },
    { timeStamp: 100, type: "input", inputType: "clearChar", codePoint: 0x0000, timeToType: 111 },
    { timeStamp: 200, type: "keyup", code: "Backspace", key: "Backspace", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,Backspace,Backspace",
    "100,clearChar,\u0000,111",
    "200,keyup,Backspace,Backspace",
  ]);
});

test("forward emulation, translate a clear word input", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "ControlLeft", key: "Control", modifiers: [] },
    { timeStamp: 200, type: "keydown", code: "Backspace", key: "Backspace", modifiers: ["Control"] },
    { timeStamp: 200, type: "input", inputType: "clearWord", codePoint: 0x0000, timeToType: 111 },
    { timeStamp: 300, type: "keyup", code: "Backspace", key: "Backspace", modifiers: ["Control"] },
    { timeStamp: 400, type: "keyup", code: "ControlLeft", key: "Control", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,ControlLeft,Control",
    "200,keydown,Backspace,Backspace",
    "200,clearWord,\u0000,111",
    "300,keyup,Backspace,Backspace",
    "400,keyup,ControlLeft,Control",
  ]);
});

test("forward emulation, translate the whitespace keys", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "Space", key: "Space", modifiers: [] },
    { timeStamp: 100, type: "input", inputType: "appendChar", codePoint: 0x0020, timeToType: 999 },
    { timeStamp: 200, type: "keyup", code: "Space", key: "Space", modifiers: [] },
    { timeStamp: 300, type: "keydown", code: "NumpadEnter", key: "Enter", modifiers: [] },
    { timeStamp: 300, type: "input", inputType: "appendLineBreak", codePoint: 0x0000, timeToType: 111 },
    { timeStamp: 400, type: "keyup", code: "NumpadEnter", key: "Enter", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,Space, ",
    "100,appendChar, ,100",
    "200,keyup,Space, ",
    "300,keydown,NumpadEnter,Enter",
    "300,appendLineBreak,\u0000,111",
    "400,keyup,NumpadEnter,Enter",
  ]);
});

test("forward emulation, incomplete events", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "", key: "Unidentified", modifiers: [] },
    { timeStamp: 100, type: "input", inputType: "appendChar", codePoint: /* "S" */ 0x0053, timeToType: 111 },
    { timeStamp: 200, type: "keyup", code: "", key: "Unidentified", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,,Unidentified", //
    "200,keyup,,Unidentified",
  ]);
});

test("reverse emulation, translate character codes", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Reverse),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "ShiftLeft", key: "Shift", modifiers: [] },
    { timeStamp: 200, type: "keydown", code: "KeyO", key: "O", modifiers: ["Shift"] },
    { timeStamp: 200, type: "input", inputType: "appendChar", codePoint: /* "O" */ 0x004f, timeToType: 111 },
    { timeStamp: 300, type: "keyup", code: "KeyO", key: "O", modifiers: ["Shift"] },
    { timeStamp: 400, type: "keyup", code: "ShiftLeft", key: "Shift", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,ShiftLeft,Shift",
    "200,keydown,KeyS,O",
    "200,appendChar,O,111",
    "300,keyup,KeyS,O",
    "400,keyup,ShiftLeft,Shift",
  ]);
});

test("reverse emulation, incomplete events", () => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Reverse),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  replay(
    listener,
    { timeStamp: 100, type: "keydown", code: "", key: "Unidentified", modifiers: [] },
    { timeStamp: 100, type: "input", inputType: "appendChar", codePoint: /* "S" */ 0x0053, timeToType: 111 },
    { timeStamp: 200, type: "keyup", code: "", key: "Unidentified", modifiers: [] },
  );

  // Assert.

  deepEqual(target.trace, [
    "100,keydown,,Unidentified", //
    "100,appendChar,S,111",
    "200,keyup,,Unidentified",
  ]);
});

function replay(target: InputListener, ...events: (IKeyboardEvent | IInputEvent)[]) {
  for (const event of events) {
    switch (event.type) {
      case "keydown":
        target.onKeyDown(event);
        break;
      case "keyup":
        target.onKeyUp(event);
        break;
      case "input":
        target.onInput(event);
        break;
    }
  }
}
