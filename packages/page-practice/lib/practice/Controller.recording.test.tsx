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
