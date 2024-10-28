import {
  Emulation,
  keyboardProps,
  Layout,
  loadKeyboard,
} from "@keybr/keyboard";
import { Settings } from "@keybr/settings";
import test from "ava";
import { emulateLayout } from "./emulation.ts";
import { tracingListener } from "./testing/fakes.ts";

test("forward emulation, translate a character input", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "ControlLeft",
    key: "Control",
    modifiers: [],
  });
  listener.onKeyDown({
    timeStamp: 200,
    code: "KeyS",
    key: "s",
    modifiers: ["Control"],
  });
  listener.onKeyUp({
    timeStamp: 300,
    code: "KeyS",
    key: "s",
    modifiers: ["Control"],
  });
  listener.onKeyUp({
    timeStamp: 400,
    code: "ControlLeft",
    key: "Control",
    modifiers: [],
  });
  listener.onKeyDown({
    timeStamp: 500,
    code: "ShiftLeft",
    key: "Shift",
    modifiers: [],
  });
  listener.onKeyDown({
    timeStamp: 600,
    code: "KeyS",
    key: "S",
    modifiers: ["Shift"],
  });
  listener.onTextInput({
    timeStamp: 600,
    inputType: "appendChar",
    codePoint: /* "S" */ 0x0053,
    timeToType: 999,
  });
  listener.onKeyUp({
    timeStamp: 700,
    code: "KeyS",
    key: "S",
    modifiers: ["Shift"],
  });
  listener.onKeyUp({
    timeStamp: 800,
    code: "ShiftLeft",
    key: "Shift",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,ControlLeft,Control",
    "200,keydown,KeyS,o",
    "300,keyup,KeyS,o",
    "400,keyup,ControlLeft,Control",
    "500,keydown,ShiftLeft,Shift",
    "600,keydown,KeyS,O",
    "600,appendChar,O,200",
    "700,keyup,KeyS,O",
    "800,keyup,ShiftLeft,Shift",
  ]);
});

test("forward emulation, translate a clear char input", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "Backspace",
    key: "Backspace",
    modifiers: [],
  });
  listener.onTextInput({
    timeStamp: 100,
    inputType: "clearChar",
    codePoint: 0x0000,
    timeToType: 111,
  });
  listener.onKeyUp({
    timeStamp: 200,
    code: "Backspace",
    key: "Backspace",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,Backspace,Backspace",
    "100,clearChar,\u0000,111",
    "200,keyup,Backspace,Backspace",
  ]);
});

test("forward emulation, translate a clear word input", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "ControlLeft",
    key: "Control",
    modifiers: [],
  });
  listener.onKeyDown({
    timeStamp: 200,
    code: "Backspace",
    key: "Backspace",
    modifiers: ["Control"],
  });
  listener.onTextInput({
    timeStamp: 200,
    inputType: "clearWord",
    codePoint: 0x0000,
    timeToType: 111,
  });
  listener.onKeyUp({
    timeStamp: 300,
    code: "Backspace",
    key: "Backspace",
    modifiers: ["Control"],
  });
  listener.onKeyUp({
    timeStamp: 400,
    code: "ControlLeft",
    key: "Control",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,ControlLeft,Control",
    "200,keydown,Backspace,Backspace",
    "200,clearWord,\u0000,111",
    "300,keyup,Backspace,Backspace",
    "400,keyup,ControlLeft,Control",
  ]);
});

test("forward emulation, translate the whitespace keys", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "Space",
    key: "Space",
    modifiers: [],
  });
  listener.onTextInput({
    timeStamp: 100,
    inputType: "appendChar",
    codePoint: 0x0020,
    timeToType: 999,
  });
  listener.onKeyUp({
    timeStamp: 200,
    code: "Space",
    key: "Space",
    modifiers: [],
  });
  listener.onKeyDown({
    timeStamp: 300,
    code: "NumpadEnter",
    key: "Enter",
    modifiers: [],
  });
  listener.onTextInput({
    timeStamp: 300,
    inputType: "appendLineBreak",
    codePoint: 0x0000,
    timeToType: 111,
  });
  listener.onKeyUp({
    timeStamp: 400,
    code: "NumpadEnter",
    key: "Enter",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,Space, ",
    "100,appendChar, ,100",
    "200,keyup,Space, ",
    "300,keydown,NumpadEnter,Enter",
    "300,appendLineBreak,\u0000,111",
    "400,keyup,NumpadEnter,Enter",
  ]);
});

test("forward emulation, incomplete events", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Forward),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "",
    key: "Undefined",
    modifiers: [],
  });
  listener.onTextInput({
    timeStamp: 100,
    inputType: "appendChar",
    codePoint: /* "S" */ 0x0053,
    timeToType: 111,
  });
  listener.onKeyUp({
    timeStamp: 200,
    code: "",
    key: "Undefined",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,,Undefined", //
    "200,keyup,,Undefined",
  ]);
});

test("reverse emulation, translate character codes", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Reverse),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "ShiftLeft",
    key: "Shift",
    modifiers: [],
  });
  listener.onKeyDown({
    timeStamp: 200,
    code: "KeyO",
    key: "O",
    modifiers: ["Shift"],
  });
  listener.onTextInput({
    timeStamp: 200,
    inputType: "appendChar",
    codePoint: /* "O" */ 0x004f,
    timeToType: 111,
  });
  listener.onKeyUp({
    timeStamp: 300,
    code: "KeyO",
    key: "O",
    modifiers: ["Shift"],
  });
  listener.onKeyUp({
    timeStamp: 400,
    code: "ShiftLeft",
    key: "Shift",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,ShiftLeft,Shift",
    "200,keydown,KeyS,O",
    "200,appendChar,O,111",
    "300,keyup,KeyS,O",
    "400,keyup,ShiftLeft,Shift",
  ]);
});

test("reverse emulation, incomplete events", (t) => {
  // Arrange.

  const target = tracingListener();
  const listener = emulateLayout(
    new Settings().set(keyboardProps.emulation, Emulation.Reverse),
    loadKeyboard(Layout.EN_DVORAK),
    target,
  );

  // Act.

  listener.onKeyDown({
    timeStamp: 100,
    code: "",
    key: "Undefined",
    modifiers: [],
  });
  listener.onTextInput({
    timeStamp: 100,
    inputType: "appendChar",
    codePoint: /* "S" */ 0x0053,
    timeToType: 111,
  });
  listener.onKeyUp({
    timeStamp: 200,
    code: "",
    key: "Undefined",
    modifiers: [],
  });

  // Assert.

  t.deepEqual(target.trace, [
    "100,keydown,,Undefined",
    "100,appendChar,S,111",
    "200,keyup,,Undefined",
  ]);
});
