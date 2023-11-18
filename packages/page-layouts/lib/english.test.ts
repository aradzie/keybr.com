import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import test from "ava";
import { letters } from "./english.ts";
import {
  bottomRowKeys,
  digitRowKeys,
  homeRowKeys,
  topRowKeys,
} from "./geometry.ts";
import { keysOnRow } from "./stats.ts";

for (const layout of [
  Layout.EN_US,
  Layout.EN_US_DVORAK,
  Layout.EN_US_COLEMAK,
  Layout.EN_US_WORKMAN,
]) {
  test(`all row keys are defined - ${layout.id}`, (t) => {
    const keyboard = loadKeyboard(layout);
    for (const { id } of keyboard.characters.values()) {
      t.true(
        digitRowKeys.has(id) ||
          topRowKeys.has(id) ||
          homeRowKeys.has(id) ||
          bottomRowKeys.has(id),
        `Unknown key id ${id}`,
      );
    }
  });
}

for (const layout of [
  Layout.EN_US,
  Layout.EN_US_DVORAK,
  Layout.EN_US_COLEMAK,
  Layout.EN_US_WORKMAN,
]) {
  test(`sum of row keys - ${layout.id}`, (t) => {
    const keyboard = loadKeyboard(layout);
    const sum =
      keysOnRow(letters, keyboard, topRowKeys) +
      keysOnRow(letters, keyboard, homeRowKeys) +
      keysOnRow(letters, keyboard, bottomRowKeys);
    t.true(Math.abs(sum - 1) < 0.01);
  });
}
