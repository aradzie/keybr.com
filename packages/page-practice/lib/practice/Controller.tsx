import { keyboardProps, useKeyboard } from "@keybr/keyboard";
import { useSettings } from "@keybr/settings";
import { playSound } from "@keybr/sound";
import { Feedback, textDisplayProps } from "@keybr/textinput";
import { emulateLayout } from "@keybr/textinput-events";
import { TextInputSound } from "@keybr/textinput-sounds";
import {
  Ctrl,
  handleHotkeys,
  useDocumentEvent,
  useWindowEvent,
} from "@keybr/widget";
import { memo, type ReactNode, useMemo, useState } from "react";
import { type PracticeState } from "./practicestate.ts";
import { Presenter } from "./Presenter.tsx";

export const Controller = memo(function Controller({
  state,
  onConfigure,
}: {
  readonly state: PracticeState;
  readonly onConfigure: () => void;
}): ReactNode {
  const {
    handleReset,
    handleSkip,
    handleKeyDown,
    handleKeyUp,
    handleInput,
    hotkeys,
  } = usePracticeState(state);
  useWindowEvent("keydown", hotkeys);
  useWindowEvent("focus", handleReset);
  useWindowEvent("blur", handleReset);
  useDocumentEvent("visibilitychange", handleReset);
  return (
    <Presenter
      state={state}
      lines={state.lines}
      onReset={handleReset}
      onSkip={handleSkip}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onInput={handleInput}
      onConfigure={onConfigure}
    />
  );
});

function usePracticeState(state: PracticeState) {
  const keyboard = useKeyboard();
  const [lines, setLines] = useState(state.lines); // Forces ui update.
  const { settings } = useSettings();
  return useMemo(() => {
    // New lesson.
    setLines(state.lines);
    const handleReset = (): void => {
      state.handleReset();
      setLines(state.lines);
    };
    const handleSkip = (): void => {
      state.handleSkip();
      setLines(state.lines);
    };
    const { onKeyDown, onKeyUp, onInput } = emulateLayout(
      keyboard,
      {
        onKeyDown: () => {},
        onKeyUp: () => {},
        onInput: (codePoint, timeStamp) => {
          state.lastLesson = null;
          const feedback = state.handleInput(codePoint, timeStamp);
          setLines(state.lines);
          playFeedbackSound(
            feedback,
            settings.get(textDisplayProps.enableSoundStyle),
          );
        },
      },
      state.settings.get(keyboardProps.emulate),
    );
    return {
      handleReset,
      handleSkip,
      handleKeyDown: onKeyDown,
      handleKeyUp: onKeyUp,
      handleInput: onInput,
      hotkeys: handleHotkeys(
        ["ArrowLeft", Ctrl, handleReset],
        ["ArrowRight", Ctrl, handleSkip],
        ["Escape", handleReset],
      ),
    };
  }, [state, keyboard]);
}

function playFeedbackSound(feedback: Feedback, option: number): void {
  if (option === 1) {
    switch (feedback) {
      case Feedback.Succeeded:
        playSound(TextInputSound.Click);
        break;
      case Feedback.Recovered:
        playSound(TextInputSound.Click);
        break;
      case Feedback.Failed:
        playSound(TextInputSound.Blip);
        break;
    }
  } else {
    switch (feedback) {
      case Feedback.Failed:
        playSound(TextInputSound.Blip);
    }
  }
}
