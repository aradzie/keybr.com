import { keyboardProps, Layout, loadKeyboard } from "@keybr/keyboard";
import { type EndReason, type RecordingRecord } from "@keybr/recording";
import { Result, TextType } from "@keybr/result";
import { Settings } from "@keybr/settings";
import {
  type Feedback,
  makeStats,
  TextInput,
  toTextInputSettings,
} from "@keybr/textinput";
import { emulateLayout } from "@keybr/textinput-events";
import { InputHandler } from "@keybr/textinput-events/lib/inputhandler.ts";
import {
  fakeEvent,
  type FakeEventInit,
} from "@keybr/textinput-events/lib/testing.ts";
import { PracticeRecorder } from "./recorder.ts";
import { recordingContext } from "./settings.ts";

export type Scenario = {
  name: string;
  text: string;
  settings: Record<string, unknown>;
  actions: (
    | FakeEventInit
    | { type: "end"; reason: EndReason }
    | { type: "exercise"; text: string }
    | { type: "leave" }
    | { type: "outside-release"; code: string; key: string; timeStamp: number }
  )[];
};

export function replayScenario(scenario: Scenario, enabled = true) {
  const records: RecordingRecord[] = [];
  const feedback: Feedback[] = [];
  const results: unknown[] = [];
  const settings = new Settings(scenario.settings);
  const keyboard = loadKeyboard(settings.get(keyboardProps.layout));
  const releaseTarget = document.createElement("div");
  let serial = 0;
  let tick = 0;
  const options = {
    applicationRevision: "fixture-revision",
    board: { id: "fixture-board", version: "1" },
    keymap: { id: "fixture-keymap", version: "2" },
    onRecord: (record: RecordingRecord) => records.push(record),
  };
  const recorder = enabled
    ? new PracticeRecorder(options, {
        uuid: () =>
          `00000000-0000-4000-8000-${String(++serial).padStart(12, "0")}`,
        now: () => ++tick,
        timeOrigin: 1700000000000,
        releaseTarget: releaseTarget as any,
      })
    : null;
  let textInput: TextInput;
  const prepare = (text: string) => {
    textInput = new TextInput(
      text,
      toTextInputSettings(settings),
      undefined,
      recorder?.onState,
    );
    recorder?.prepare(() =>
      recordingContext(text, settings, keyboard, options),
    );
  };
  prepare(scenario.text);
  const target = {
    onKeyDown: () => {},
    onKeyUp: () => {},
    onInput: (event: Parameters<TextInput["onInput"]>[0]) => {
      feedback.push(textInput.onInput(event));
      if (textInput.completed) {
        const result = Result.fromStats(
          Layout.EN_US,
          TextType.GENERATED,
          1700000000000,
          makeStats(textInput.steps),
        );
        results.push({
          result: result.toJSON(),
          accepted: result.validate(),
          score: result.score,
          accuracy: result.accuracy,
        });
        recorder?.end("completed", result);
      }
    },
  };
  const handler = new InputHandler();
  handler.setCallbacks({
    ...emulateLayout(settings, keyboard, recorder?.observe(target) ?? target),
    inputObserver: recorder ?? undefined,
  });
  for (const action of scenario.actions) {
    switch (action.type) {
      case "exercise":
        prepare(action.text);
        break;
      case "end":
        recorder?.end(action.reason);
        break;
      case "leave":
        recorder?.leave();
        break;
      case "outside-release": {
        const event = new KeyboardEvent("keyup", action);
        Object.defineProperty(event, "timeStamp", { value: action.timeStamp });
        releaseTarget.dispatchEvent(event);
        break;
      }
      case "keydown":
      case "keyup":
        handler.handleKeyboard(fakeEvent(action));
        break;
      case "input":
        handler.handleInput(fakeEvent(action));
        break;
      case "beforeinput":
        throw new Error("Not observed by keybr");
      default:
        handler.handleComposition(fakeEvent(action));
        break;
    }
  }
  recorder?.leave();
  return JSON.parse(
    JSON.stringify({
      records,
      feedback,
      results,
      final: textInput!.snapshot(),
    }),
  );
}
