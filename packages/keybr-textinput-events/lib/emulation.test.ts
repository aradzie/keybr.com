import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import { Char_Backspace, Char_LineFeed, Char_Tab } from "./chars.ts";
import { emulateLayout } from "./emulation.ts";
import { newFakeKeyboardEvent, tracingListener } from "./testing/fakes.ts";

test("translate without emulation", (t) => {
  const trace: string[] = [];
  const layout = Layout.EN_US;
  const keyboard = loadKeyboard(layout, { full: false });
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
    newFakeKeyboardEvent({
      timeStamp: 1,
      type: "keydown",
      code: "KeyS",
      key: "s",
    }),
  );
  listener.onInput(0x73, 1);
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 2,
      type: "keyup",
      code: "KeyS",
      key: "s",
    }),
  );

  // Press Shift.

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 3,
      type: "keydown",
      code: "ShiftLeft",
      key: "Shift",
      shiftKey: true,
    }),
  );

  // Input Shift "S".

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 4,
      type: "keydown",
      code: "KeyS",
      key: "S",
      shiftKey: true,
    }),
  );
  listener.onInput(0x53, 4);
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 5,
      type: "keyup",
      code: "KeyS",
      key: "S",
      shiftKey: true,
    }),
  );

  // Release Shift.

  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 6,
      type: "keyup",
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
    newFakeKeyboardEvent({
      timeStamp: 1,
      type: "keydown",
      code: "ControlLeft",
      key: "Control",
      ctrlKey: true,
    }),
  );

  // Input Ctrl "s".

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 2,
      type: "keydown",
      code: "KeyS",
      key: "s",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 3,
      type: "keyup",
      code: "KeyS",
      key: "s",
      ctrlKey: true,
    }),
  );

  // Release Control.

  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 4,
      type: "keyup",
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
    newFakeKeyboardEvent({
      timeStamp: 1,
      type: "keydown",
      code: "Backspace",
      key: "Backspace",
    }),
  );
  listener.onInput(Char_Backspace, 1);
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 2,
      type: "keyup",
      code: "Backspace",
      key: "Backspace",
    }),
  );

  // Input Tab.

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 3,
      type: "keydown",
      code: "Tab",
      key: "Tab",
    }),
  );
  listener.onInput(Char_Tab, 3);
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 4,
      type: "keyup",
      code: "Tab",
      key: "Tab",
    }),
  );

  // Input Enter.

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 5,
      type: "keydown",
      code: "Enter",
      key: "Enter",
    }),
  );
  listener.onInput(Char_LineFeed, 5);
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 6,
      type: "keyup",
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
    newFakeKeyboardEvent({
      timeStamp: 1,
      type: "keydown",
      code: "ControlLeft",
      key: "Control",
      ctrlKey: true,
    }),
  );

  // Input Backspace.

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 2,
      type: "keydown",
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 3,
      type: "keyup",
      code: "Backspace",
      key: "Backspace",
      ctrlKey: true,
    }),
  );

  // Input Tab.

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 4,
      type: "keydown",
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 5,
      type: "keyup",
      code: "Tab",
      key: "Tab",
      ctrlKey: true,
    }),
  );

  // Input Enter.

  listener.onKeyDown(
    newFakeKeyboardEvent({
      timeStamp: 6,
      type: "keydown",
      code: "Enter",
      key: "Enter",
      ctrlKey: true,
    }),
  );
  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 7,
      type: "keyup",
      code: "Enter",
      key: "Enter",
      ctrlKey: true,
    }),
  );

  // Release Control.

  listener.onKeyUp(
    newFakeKeyboardEvent({
      timeStamp: 8,
      type: "keyup",
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
