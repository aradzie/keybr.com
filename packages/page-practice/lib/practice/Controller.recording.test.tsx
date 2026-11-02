import assert from "node:assert/strict";
import { test } from "node:test";
import { FakeIntlProvider } from "@keybr/intl";
import {
  Emulation,
  KeyboardContext,
  keyboardProps,
  Layout,
  loadKeyboard,
} from "@keybr/keyboard";
import { CustomTextLesson, lessonProps } from "@keybr/lesson";
import { FakePhoneticModel } from "@keybr/phonetic-model";
import { type RecordingRecord } from "@keybr/recording";
import { RecordingContext } from "@keybr/recording-browser";
import { type Result } from "@keybr/result";
import { Settings, SettingsContext } from "@keybr/settings";
import { act, fireEvent, render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { StrictMode } from "react";
import { Controller } from "./Controller.tsx";
import { Progress } from "./state/index.ts";

class FixedLesson extends CustomTextLesson {
  override generate() {
    return "abcdefghij";
  }
}

function setup(enabled = true) {
  let settings = new Settings().set(keyboardProps.emulation, Emulation.None);
  let keyboard = loadKeyboard(Layout.EN_US);
  const makeProgress = () =>
    new Progress(
      settings,
      new FixedLesson(settings, keyboard, new FakePhoneticModel()),
    );
  let progress = makeProgress();
  const records: RecordingRecord[] = [];
  const results: Result[] = [];
  const options = {
    applicationRevision: "controller-test",
    board: null,
    keymap: null,
    onRecord: (r: RecordingRecord) => records.push(r),
  };
  const onResult = (result: Result) => {
    results.push(result);
    if (result.validate()) progress.append(result);
  };
  const tree = () => (
    <StrictMode>
      <FakeIntlProvider>
        <SettingsContext value={{ settings, updateSettings() {} }}>
          <KeyboardContext value={keyboard}>
            <RecordingContext value={enabled ? options : null}>
              <Controller progress={progress} onResult={onResult} />
            </RecordingContext>
          </KeyboardContext>
        </SettingsContext>
      </FakeIntlProvider>
    </StrictMode>
  );
  const view = render(tree());
  const input = () => view.container.querySelector("textarea")!;
  const type = (text: string, started = 100) => {
    for (const [i, char] of [...text].entries()) {
      const code = `Key${char.toUpperCase()}`;
      const down = new KeyboardEvent("keydown", {
        code,
        key: char,
        bubbles: true,
      });
      Object.defineProperty(down, "timeStamp", { value: started + i * 200 });
      fireEvent(input(), down);
      const event = new InputEvent("input", {
        inputType: "insertText",
        data: char,
        bubbles: true,
      });
      Object.defineProperty(event, "timeStamp", { value: started + i * 200 });
      fireEvent(input(), event);
      fireEvent.keyUp(input(), { code, key: char });
    }
  };
  return {
    records,
    results,
    type,
    view,
    input,
    get progress() {
      return progress;
    },
    changeSettings() {
      settings = settings.set(lessonProps.targetSpeed, 200);
      progress = makeProgress();
      view.rerender(tree());
    },
    changeKeyboard() {
      keyboard = loadKeyboard(Layout.EN_DVORAK);
      progress = makeProgress();
      view.rerender(tree());
    },
  };
}

function ends(records: RecordingRecord[]) {
  return records.filter((r) => r.type === "end");
}

for (const { reason, title, shortcut } of [
  {
    reason: "reset",
    title: "Reset the current lesson",
    shortcut: "{Control>}{ArrowLeft}{/Control}",
  },
  {
    reason: "skipped",
    title: "Skip the current lesson",
    shortcut: "{Control>}{ArrowRight}{/Control}",
  },
  {
    reason: "reset",
    title: "Reset the current lesson",
    shortcut: "{Escape}",
  },
]) {
  for (const interaction of ["pointer", "shortcut"]) {
    // Escape shares its pointer control with Ctrl+ArrowLeft.
    if (interaction === "pointer" && shortcut === "{Escape}") continue;
    test(`Controller records ${reason} once via ${interaction} ${shortcut}`, async (t) => {
      const page = setup();
      t.after(() => page.view.unmount());
      const user = userEvent.setup();
      await user.click(page.input());
      page.type("abc");
      const generate = t.mock.method(page.progress.lesson, "generate");
      if (interaction === "pointer") {
        await user.click(page.view.getByTitle(title, { exact: false }));
      } else {
        await user.keyboard(shortcut);
      }
      assert.equal(document.activeElement, page.input());
      assert.deepEqual(
        ends(page.records).map((r) => r.reason),
        [reason],
      );
      assert.equal(generate.mock.callCount(), reason === "skipped" ? 1 : 0);
      assert.equal(page.results.length, 0);
      assert.equal(page.progress.summaryStats.count, 0);

      // Later overlapping lifecycle and control notifications cannot end it again.
      await user.click(document.body);
      fireEvent(window, new window.Event("blur"));
      fireEvent(document, new window.Event("visibilitychange"));
      fireEvent(window, new window.Event("focus"));
      await user.click(page.view.getByTitle(title, { exact: false }));
      assert.deepEqual(
        ends(page.records).map((r) => r.reason),
        [reason],
      );

      // The reset exercise still completes and advances progress normally.
      page.type("abcdefghij", 1000);
      assert.deepEqual(
        ends(page.records).map((r) => r.reason),
        [reason, "completed"],
      );
      assert.equal(ends(page.records)[1]?.resultAccepted, true);
      assert.equal(page.results.length, 1);
      assert.equal(page.progress.summaryStats.count, 1);
      assert.equal(page.records.filter((r) => r.type === "start").length, 2);
    });
  }
}

test("Controller records genuine pointer focus loss once", async (t) => {
  const page = setup();
  t.after(() => page.view.unmount());
  const user = userEvent.setup();
  await user.click(page.input());
  page.type("abc");
  await user.click(document.body);
  assert.notEqual(document.activeElement, page.input());
  fireEvent(window, new window.Event("blur"));
  fireEvent(document, new window.Event("visibilitychange"));
  fireEvent(window, new window.Event("focus"));
  await user.click(page.input());
  await user.click(
    page.view.getByTitle("Skip the current lesson", { exact: false }),
  );
  assert.deepEqual(
    ends(page.records).map((r) => r.reason),
    ["focus-loss"],
  );
  assert.equal(page.records.filter((r) => r.type === "start").length, 1);
  assert.equal(page.results.length, 0);
});

test("Controller records native completion and progression identically in StrictMode", (t) => {
  t.mock.method(Date, "now", () => 1700000000000);
  const enabled = setup();
  t.after(() => enabled.view.unmount());
  enabled.type("abcdefghij");
  assert.equal(ends(enabled.records)[0]?.reason, "completed");
  assert.equal(ends(enabled.records)[0]?.resultAccepted, true);
  assert.equal(enabled.records.filter((r) => r.type === "start").length, 1);
  assert.equal(enabled.results.length, 1);
  const expected = JSON.stringify({
    results: enabled.results,
    keys: [...enabled.progress.keyStatsMap],
    stats: enabled.progress.summaryStats,
  });
  enabled.view.unmount();
  const disabled = setup(false);
  t.after(() => disabled.view.unmount());
  disabled.type("abcdefghij");
  assert.equal(
    JSON.stringify({
      results: disabled.results,
      keys: [...disabled.progress.keyStatsMap],
      stats: disabled.progress.summaryStats,
    }),
    expected,
  );
  assert.equal(disabled.records.length, 0);
  disabled.view.unmount();
});

test("Controller deduplicates empty focus resets and identifies lifecycle endings", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const page = setup();
  t.after(() => page.view.unmount());
  fireEvent(window, new window.Event("focus"));
  fireEvent(window, new window.Event("blur"));
  fireEvent(document, new window.Event("visibilitychange"));
  assert.equal(page.records.length, 0);
  page.type("a");
  fireEvent(window, new window.Event("blur"));
  fireEvent(document, new window.Event("visibilitychange"));
  fireEvent(window, new window.Event("focus"));
  assert.deepEqual(
    ends(page.records).map((r) => r.reason),
    ["focus-loss"],
  );
  page.type("a");
  act(() => t.mock.timers.tick(10000));
  assert.equal(ends(page.records).at(-1)?.reason, "inactivity");
  page.type("a");
  page.changeSettings();
  assert.equal(ends(page.records).at(-1)?.reason, "settings-change");
  page.type("a");
  page.changeKeyboard();
  assert.equal(ends(page.records).at(-1)?.reason, "keyboard-change");
  page.type("a");
  page.view.unmount();
  assert.equal(ends(page.records).at(-1)?.reason, "navigation");
  const count = page.records.length;
  fireEvent.input(document.body, {
    inputType: "insertText",
    data: "private settings text",
  });
  fireEvent.keyDown(document.body, { code: "KeyS", key: "s" });
  assert.equal(page.records.length, count);
});

for (const held of [false, true]) {
  test(`Controller ends a ${held ? "held" : "released"} modifier attempt on inactivity`, (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const page = setup();
    t.after(() => page.view.unmount());
    fireEvent.focus(page.input());
    fireEvent.click(
      page.view.getByTitle("Reset the current lesson", { exact: false }),
    );
    act(() => t.mock.timers.tick(10001));
    assert.equal(page.records.length, 0);

    fireEvent.keyDown(page.input(), { code: "ShiftLeft", key: "Shift" });
    if (!held)
      fireEvent.keyUp(page.input(), { code: "ShiftLeft", key: "Shift" });
    const first = page.records.find((r) => r.type === "start");
    assert.ok(first, "modifier keydown starts an attempt");
    act(() => t.mock.timers.tick(9999));
    assert.equal(ends(page.records).length, 0);
    act(() => t.mock.timers.tick(2));
    assert.deepEqual(
      ends(page.records).map((r) => r.reason),
      ["inactivity"],
    );
    assert.equal(
      page.records.filter(
        (r) => r.type === "original" && r.event.type === "keyup",
      ).length,
      held ? 0 : 1,
    );

    fireEvent(window, new window.Event("blur"));
    fireEvent(document, new window.Event("visibilitychange"));
    fireEvent(window, new window.Event("focus"));
    assert.deepEqual(
      ends(page.records).map((r) => r.reason),
      ["inactivity"],
    );
    assert.equal(page.records.filter((r) => r.type === "start").length, 1);

    page.type("a");
    const starts = page.records.filter((r) => r.type === "start");
    assert.equal(starts.length, 2);
    assert.notEqual(starts[1].attemptId, first.attemptId);
    if (held) {
      fireEvent.keyUp(page.input(), { code: "ShiftLeft", key: "Shift" });
      const release = page.records.find(
        (r) =>
          r.type === "original" &&
          r.event.type === "keyup" &&
          r.event.code === "ShiftLeft",
      );
      assert.equal(release?.attemptId, first.attemptId);
    }
    page.type("bcdefghij", 300);
    assert.equal(page.results.length, 1);
    assert.equal(page.progress.summaryStats.count, 1);
    fireEvent(window, new window.Event("blur"));
    fireEvent(document, new window.Event("visibilitychange"));
    fireEvent(window, new window.Event("focus"));
    act(() => t.mock.timers.tick(10001));
    page.view.unmount();
    assert.deepEqual(
      ends(page.records).map((r) => r.reason),
      ["inactivity", "completed"],
    );
  });
}

for (const { code, key } of [
  { code: "ShiftLeft", key: "Shift" },
  { code: "KeyA", key: "a" },
]) {
  test(`Controller ignores repeated ${key} keydowns for inactivity scheduling`, (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    const page = setup();
    t.after(() => page.view.unmount());
    fireEvent.keyDown(page.input(), { code, key });
    for (let i = 0; i < 11; i++) {
      act(() => t.mock.timers.tick(1000));
      fireEvent.keyDown(page.input(), { code, key, repeat: true });
    }
    assert.deepEqual(
      ends(page.records).map((r) => r.reason),
      ["inactivity"],
    );
    const count = page.records.length;
    act(() => t.mock.timers.tick(10001));
    assert.equal(page.records.length, count);
    fireEvent.keyUp(page.input(), { code, key });
    assert.equal(page.records.filter((r) => r.type === "start").length, 1);
    assert.equal(page.results.length, 0);
  });
}

test("Controller preserves an existing input inactivity deadline on modifier keydown", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const page = setup();
  t.after(() => page.view.unmount());
  page.type("a");
  act(() => t.mock.timers.tick(9000));
  fireEvent.keyDown(page.input(), { code: "ShiftLeft", key: "Shift" });
  fireEvent.keyUp(page.input(), { code: "ShiftLeft", key: "Shift" });
  act(() => t.mock.timers.tick(1001));
  assert.deepEqual(
    ends(page.records).map((r) => r.reason),
    ["inactivity"],
  );
});
