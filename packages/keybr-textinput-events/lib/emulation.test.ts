import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import { emulateLayout } from "./emulation.ts";
import { tracingListener } from "./testing/fakes.ts";
import { type KeyEvent } from "./types.ts";

test("translate without emulation", (t) => {
  // Arrange.

  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US_DVORAK);
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, false);

  // Assert.

  t.is(listener, target);
});

test("translate with emulation", (t) => {
  // Arrange.

  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US_DVORAK);
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);

  // Assert.

  t.not(listener, target);
});

test("translate a normal input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US_DVORAK);
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);

  // Act.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "ShiftLeft",
      key: "Shift",
      shiftKey: true,
    }),
  );
  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 2,
      code: "KeyS",
      key: "S",
      shiftKey: true,
    }),
  );
  listener.onTextInput({
    timeStamp: 2,
    inputType: "appendChar",
    codePoint: 0x0053,
  });
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 3,
      code: "KeyS",
      key: "S",
      shiftKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 4,
      code: "ShiftLeft",
      key: "Shift",
      shiftKey: false,
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:ShiftLeft,Shift,1",
    "keydown:KeyS,O,2",
    "appendChar:O,2",
    "keyup:KeyS,O,3",
    "keyup:ShiftLeft,Shift,4",
  ]);
});

test("translate a control input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US_DVORAK);
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);

  // Act.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: true,
    }),
  );
  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 2,
      code: "KeyS",
      key: "s",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 3,
      code: "KeyS",
      key: "s",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 4,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: false,
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:ControlLeft,Control,1",
    "keydown:KeyS,o,2",
    "keyup:KeyS,o,3",
    "keyup:ControlLeft,Control,4",
  ]);
});

test("translate a clear char input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US_DVORAK);
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);

  // Act.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: false,
    }),
  );
  listener.onTextInput({
    timeStamp: 1,
    inputType: "clearChar",
    codePoint: 0x0000,
  });
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 2,
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

test("translate a clear word input", (t) => {
  // Arrange.

  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US_DVORAK);
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);

  // Act.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: true,
    }),
  );
  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 2,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );
  listener.onTextInput({
    timeStamp: 2,
    inputType: "clearWord",
    codePoint: 0x0000,
  });
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 3,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 4,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: false,
    }),
  );

  // Assert.

  t.deepEqual(trace, [
    "keydown:ControlLeft,Control,1",
    "keydown:Backspace,Backspace,2",
    "clearWord:\u0000,2",
    "keyup:Backspace,Backspace,3",
    "keyup:ControlLeft,Control,4",
  ]);
});

function newKeyEvent({
  timeStamp,
  code,
  key,
  shiftKey = false,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  location = 0,
  repeat = false,
}: {
  timeStamp: number;
  code: string;
  key: string;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  location?: number;
  repeat?: boolean;
}): KeyEvent {
  return {
    timeStamp,
    code,
    key,
    shiftKey,
    altKey,
    ctrlKey,
    metaKey,
    location,
    repeat,
  };
}
