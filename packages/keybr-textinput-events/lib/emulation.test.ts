import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import { Char_Backspace, Char_LineFeed, Char_Tab } from "./chars.ts";
import { emulateLayout } from "./emulation.ts";
import { tracingListener } from "./testing/fakes.ts";
import { type KeyEvent } from "./types.ts";

test("translate without emulation", (t) => {
  const trace: string[] = [];
  const keyboard = loadKeyboard(Layout.EN_US, { full: false });
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, false);

  t.is(listener, target);
});

test("translate normal keys without modifiers", (t) => {
  const trace: string[] = [];
  const layout = Layout.EN_US_DVORAK;
  const keyboard = loadKeyboard(layout, { full: false });
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);
  t.not(listener, target);

  // Input "s".

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "KeyS",
      key: "s",
    }),
  );
  listener.onInput(0x73, 1);
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 2,
      code: "KeyS",
      key: "s",
    }),
  );

  // Press Shift.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 3,
      code: "ShiftLeft",
      key: "Shift",
      shiftKey: true,
    }),
  );

  // Input Shift "S".

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 4,
      code: "KeyS",
      key: "S",
      shiftKey: true,
    }),
  );
  listener.onInput(0x53, 4);
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 5,
      code: "KeyS",
      key: "S",
      shiftKey: true,
    }),
  );

  // Release Shift.

  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 6,
      code: "ShiftLeft",
      key: "Shift",
      shiftKey: false,
    }),
  );

  // Check results.

  t.deepEqual(trace, [
    // "s"
    "keydown:KeyS,o,1",
    "input:o,1",
    "keyup:KeyS,o,2",
    // Shift "S"
    "keydown:ShiftLeft,Shift,3",
    "keydown:KeyS,O,4",
    "input:O,4",
    "keyup:KeyS,O,5",
    "keyup:ShiftLeft,Shift,6",
  ]);
});

test("translate normal keys with modifiers", (t) => {
  const trace: string[] = [];
  const layout = Layout.EN_US_DVORAK;
  const keyboard = loadKeyboard(layout, { full: false });
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);
  t.not(listener, target);

  // Press Control.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: true,
    }),
  );

  // Input Ctrl "s".

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

  // Release Control.

  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 4,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: false,
    }),
  );

  // Check results.

  t.deepEqual(trace, [
    // Ctrl "s"
    "keydown:ControlLeft,Control,1",
    "keydown:KeyS,o,2",
    "keyup:KeyS,o,3",
    "keyup:ControlLeft,Control,4",
  ]);
});

test("translate special keys without modifiers", (t) => {
  const trace: string[] = [];
  const layout = Layout.EN_US_DVORAK;
  const keyboard = loadKeyboard(layout, { full: false });
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);
  t.not(listener, target);

  // Input Backspace.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "Backspace",
      key: "Backspace",
    }),
  );
  listener.onInput(Char_Backspace, 1);
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 2,
      code: "Backspace",
      key: "Backspace",
    }),
  );

  // Input Tab.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 3,
      code: "Tab",
      key: "Tab",
    }),
  );
  listener.onInput(Char_Tab, 3);
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 4,
      code: "Tab",
      key: "Tab",
    }),
  );

  // Input Enter.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 5,
      code: "Enter",
      key: "Enter",
    }),
  );
  listener.onInput(Char_LineFeed, 5);
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 6,
      code: "Enter",
      key: "Enter",
    }),
  );

  // Check results.

  t.deepEqual(trace, [
    // Backspace
    "keydown:Backspace,Backspace,1",
    "input:\u0008,1",
    "keyup:Backspace,Backspace,2",
    // Tab
    "keydown:Tab,Tab,3",
    "input:\u0009,3",
    "keyup:Tab,Tab,4",
    // Enter
    "keydown:Enter,Enter,5",
    "input:\u000a,5",
    "keyup:Enter,Enter,6",
  ]);
});

test("translate special keys with modifiers", (t) => {
  const trace: string[] = [];
  const layout = Layout.EN_US_DVORAK;
  const keyboard = loadKeyboard(layout, { full: false });
  const target = tracingListener(trace);
  const listener = emulateLayout(keyboard, target, true);
  t.not(listener, target);

  // Press Control.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 1,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: true,
    }),
  );

  // Input Backspace.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 2,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 3,
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );

  // Input Tab.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 4,
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 5,
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    }),
  );

  // Input Enter.

  listener.onKeyDown(
    newKeyEvent({
      timeStamp: 6,
      code: "Enter",
      key: "Enter",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 7,
      code: "Enter",
      key: "Enter",
      ctrlKey: true,
    }),
  );

  // Release Control.

  listener.onKeyUp(
    newKeyEvent({
      timeStamp: 8,
      code: "ControlLeft",
      key: "Control",
      ctrlKey: false,
    }),
  );

  // Check results.

  t.deepEqual(trace, [
    // Press Control
    "keydown:ControlLeft,Control,1",
    // Backspace
    "keydown:Backspace,Backspace,2",
    "keyup:Backspace,Backspace,3",
    // Tab
    "keydown:Tab,Tab,4",
    "keyup:Tab,Tab,5",
    // Enter
    "keydown:Enter,Enter,6",
    "keyup:Enter,Enter,7",
    // Release Control
    "keyup:ControlLeft,Control,8",
  ]);
});

function newKeyEvent({
  timeStamp = 0,
  code,
  key,
  shiftKey = false,
  altKey = false,
  ctrlKey = false,
  metaKey = false,
  location = 0,
  repeat = false,
  modifiers = [],
}: {
  timeStamp?: number;
  code: string;
  key: string;
  shiftKey?: boolean;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  location?: number;
  repeat?: boolean;
  modifiers?: readonly string[];
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
    modifiers,
  };
}
