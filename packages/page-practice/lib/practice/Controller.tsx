import { type Keyboard, type KeyId, useKeyboard } from "@keybr/keyboard";
import {
  PracticeRecorder,
  type RecorderOptions,
  RecordingContext,
  recordingContext,
} from "@keybr/recording-browser";
import { type Result } from "@keybr/result";
import { flattenStyledText, type LineList } from "@keybr/textinput";
import {
  addKey,
  deleteKey,
  emulateLayout,
  type InputListener,
  type InputObserver,
} from "@keybr/textinput-events";
import { makeSoundPlayer } from "@keybr/textinput-sounds";
import {
  useDocumentEvent,
  useHotkeys,
  useTimeout,
  useWindowEvent,
} from "@keybr/widget";
import {
  memo,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Presenter } from "./Presenter.tsx";
import {
  type LastLesson,
  LessonState,
  makeLastLesson,
  type Progress,
} from "./state/index.ts";

export const Controller = memo(function Controller({
  progress,
  onResult,
}: {
  readonly progress: Progress;
  readonly onResult: (result: Result) => void;
}): ReactNode {
  const {
    state,
    handleFocusReset,
    inputObserver,
    handleResetLesson,
    handleSkipLesson,
    handleKeyDown,
    handleKeyUp,
    handleInput,
  } = useLessonState(progress, onResult);
  useHotkeys({
    ["Ctrl+ArrowLeft"]: handleResetLesson,
    ["Ctrl+ArrowRight"]: handleSkipLesson,
    ["Escape"]: handleResetLesson,
  });
  useWindowEvent("focus", handleFocusReset);
  useWindowEvent("blur", handleFocusReset);
  useDocumentEvent("visibilitychange", handleFocusReset);
  return (
    <Presenter
      inputObserver={inputObserver}
      onFocusReset={handleFocusReset}
      state={state}
      lines={state.lines}
      depressedKeys={state.depressedKeys}
      onResetLesson={handleResetLesson}
      onSkipLesson={handleSkipLesson}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onInput={handleInput}
    />
  );
});

function useLessonState(
  progress: Progress,
  onResult: (result: Result) => void,
) {
  const keyboard = useKeyboard();
  const recordingOptions = useContext(RecordingContext);
  const recorder = useMemo(
    () => (recordingOptions ? new PracticeRecorder(recordingOptions) : null),
    [recordingOptions],
  );
  useWindowEvent("pagehide", () => recorder?.leave());
  const timeout = useTimeout();
  const [key, setKey] = useState(0); // Creates new LessonState instances.
  const [, setLines] = useState<LineList>({ text: "", lines: [] }); // Forces UI update.
  const [, setDepressedKeys] = useState<readonly KeyId[]>([]); // Forces UI update.
  const [memory] = useState(() => new LessonMemory(onResult));
  useEffect(() => memory.setOnResult(onResult), [memory, onResult]);

  const session = useMemo(() => {
    timeout.cancel();
    memory.prepare(progress, keyboard, recorder, recordingOptions);
    // New lesson.
    const state = new LessonState(
      progress,
      (result, textInput) => {
        recorder?.end("completed", result);
        setKey(key + 1);
        memory.complete(result, makeLastLesson(result, textInput.steps));
      },
      recorder?.onState,
    );
    const prepare = () =>
      recorder?.prepare(() =>
        recordingContext(
          flattenStyledText(state.textInput.text),
          state.settings,
          keyboard,
          recordingOptions!,
        ),
      );
    prepare();
    state.lastLesson = memory.lastLesson;
    const reset = (reason: "reset" | "focus-loss" | "inactivity") => {
      recorder?.end(reason);
      state.resetLesson();
      prepare();
      setLines(state.lines);
      setDepressedKeys((state.depressedKeys = []));
      timeout.cancel();
    };
    const scheduleInactivity = () =>
      timeout.schedule(() => reset("inactivity"), 10000);
    const handleResetLesson = () => reset("reset");
    const handleFocusReset = () => reset("focus-loss");
    const handleSkipLesson = () => {
      recorder?.end("skipped");
      state.skipLesson();
      prepare();
      setLines(state.lines);
      setDepressedKeys((state.depressedKeys = []));
      timeout.cancel();
    };
    const playSounds = makeSoundPlayer(state.settings);
    const target: InputListener = {
      onKeyDown: (event) => {
        setDepressedKeys(
          (state.depressedKeys = addKey(state.depressedKeys, event.code)),
        );
      },
      onKeyUp: (event) => {
        setDepressedKeys(
          (state.depressedKeys = deleteKey(state.depressedKeys, event.code)),
        );
      },
      onInput: (event) => {
        state.lastLesson = null;
        const feedback = state.onInput(event);
        setLines(state.lines);
        playSounds(feedback);
        scheduleInactivity();
      },
    };
    const { onKeyDown, onKeyUp, onInput } = emulateLayout(
      state.settings,
      keyboard,
      recorder?.observe(target) ?? target,
    );
    return {
      prepare,
      inputObserver: recorder
        ? ({
            onEvent: (event) => {
              // A modifier can start an attempt without producing text input.
              // Preserve existing input deadlines and ignore held-key repeats.
              if (
                event.type === "keydown" &&
                "repeat" in event &&
                !event.repeat &&
                !timeout.pending
              )
                scheduleInactivity();
              return recorder.onEvent(event);
            },
          } satisfies InputObserver)
        : undefined,
      handleFocusReset,
      state,
      handleResetLesson,
      handleSkipLesson,
      handleKeyDown: onKeyDown,
      handleKeyUp: onKeyUp,
      handleInput: onInput,
    };
  }, [progress, keyboard, timeout, key, recorder, recordingOptions, memory]);
  useEffect(() => {
    session.prepare();
    return () => recorder?.leave();
  }, [recorder, session]);
  return session;
}

/** Imperative lesson history survives the next generated exercise. */
class LessonMemory {
  lastLesson: LastLesson | null = null;
  #onResult: (result: Result) => void;
  #progress: Progress | null = null;
  #keyboard: Keyboard | null = null;
  #recorder: PracticeRecorder | null = null;
  #recordingOptions: RecorderOptions | null = null;

  constructor(onResult: (result: Result) => void) {
    this.#onResult = onResult;
  }
  setOnResult(onResult: (result: Result) => void) {
    this.#onResult = onResult;
  }
  complete(result: Result, lastLesson: LastLesson) {
    this.lastLesson = lastLesson;
    this.#onResult(result);
  }
  prepare(
    progress: Progress,
    keyboard: Keyboard,
    recorder: PracticeRecorder | null,
    recordingOptions: RecorderOptions | null,
  ) {
    const contextChanged =
      JSON.stringify([
        this.#recordingOptions?.board,
        this.#recordingOptions?.keymap,
      ]) !==
      JSON.stringify([recordingOptions?.board, recordingOptions?.keymap]);
    if (this.#recorder !== recorder)
      this.#recorder?.leave(
        contextChanged ? "keyboard-change" : "settings-change",
      );
    if (
      (this.#keyboard != null &&
        (this.#keyboard.layout !== keyboard.layout ||
          this.#keyboard.geometry !== keyboard.geometry)) ||
      contextChanged
    )
      recorder?.end("keyboard-change");
    else if (this.#progress?.settings !== progress.settings)
      recorder?.end("settings-change");
    this.#keyboard = keyboard;
    this.#progress = progress;
    this.#recorder = recorder;
    this.#recordingOptions = recordingOptions;
  }
}
