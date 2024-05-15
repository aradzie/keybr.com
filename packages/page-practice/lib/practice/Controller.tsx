import { useKeyboard } from "@keybr/keyboard";
import { type Settings } from "@keybr/settings";
import { loadSounds, playSound } from "@keybr/sound";
import { Feedback, PlaySounds, textDisplayProps } from "@keybr/textinput";
import { addKey, deleteKey, emulateLayout } from "@keybr/textinput-events";
import { TextInputSound, textInputSounds } from "@keybr/textinput-sounds";
import {
  useDocumentEvent,
  useHotkeys,
  useTimeout,
  useWindowEvent,
} from "@keybr/widget";
import { memo, type ReactNode, useMemo, useState } from "react";
import { Presenter } from "./Presenter.tsx";
import { type LessonState } from "./state/index.ts";

export const Controller = memo(function Controller({
  state,
  onConfigure,
}: {
  readonly state: LessonState;
  readonly onConfigure: () => void;
}): ReactNode {
  const {
    handleResetLesson,
    handleSkipLesson,
    handleKeyDown,
    handleKeyUp,
    handleTextInput,
  } = useLessonState(state);
  useHotkeys(
    ["Ctrl+ArrowLeft", handleResetLesson],
    ["Ctrl+ArrowRight", handleSkipLesson],
    ["Escape", handleResetLesson],
  );
  useWindowEvent("focus", handleResetLesson);
  useWindowEvent("blur", handleResetLesson);
  useDocumentEvent("visibilitychange", handleResetLesson);
  return (
    <Presenter
      state={state}
      lines={state.lines}
      depressedKeys={state.depressedKeys}
      onResetLesson={handleResetLesson}
      onSkipLesson={handleSkipLesson}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onTextInput={handleTextInput}
      onConfigure={onConfigure}
    />
  );
});

function useLessonState(state: LessonState) {
  const keyboard = useKeyboard();
  const timeout = useTimeout();
  const [_0, setLines] = useState(state.lines); // Forces ui update.
  const [_1, setDepressedKeys] = useState(state.depressedKeys); // Forces ui update.

  return useMemo(() => {
    // New lesson.
    setLines(state.lines);
    setDepressedKeys(state.depressedKeys);
    const handleResetLesson = (): void => {
      state.resetLesson();
      setLines(state.lines);
      setDepressedKeys((state.depressedKeys = []));
      timeout.cancel();
    };
    const handleSkipLesson = (): void => {
      state.skipLesson();
      setLines(state.lines);
      setDepressedKeys((state.depressedKeys = []));
      timeout.cancel();
    };
    const playSounds = makeSoundPlayer(state.settings);
    const { onKeyDown, onKeyUp, onTextInput } = emulateLayout(
      state.settings,
      keyboard,
      {
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
        onTextInput: (event) => {
          state.lastLesson = null;
          const feedback = state.onTextInput(event);
          setLines(state.lines);
          playSounds(feedback);
          timeout.schedule(handleResetLesson, 10000);
        },
      },
    );
    return {
      handleResetLesson,
      handleSkipLesson,
      handleKeyDown: onKeyDown,
      handleKeyUp: onKeyUp,
      handleTextInput: onTextInput,
    };
  }, [state, keyboard, timeout]);
}

function makeSoundPlayer(settings: Settings) {
  const playSounds = settings.get(textDisplayProps.playSounds);
  const soundVolume = settings.get(textDisplayProps.soundVolume);
  return (feedback: Feedback): void => {
    loadSounds(textInputSounds);
    if (playSounds === PlaySounds.All) {
      switch (feedback) {
        case Feedback.Succeeded:
        case Feedback.Recovered:
          playSound(TextInputSound.Click, soundVolume);
          break;
        case Feedback.Failed:
          playSound(TextInputSound.Blip, soundVolume);
          break;
      }
    }
    if (playSounds === PlaySounds.ErrorsOnly) {
      switch (feedback) {
        case Feedback.Failed:
          playSound(TextInputSound.Blip, soundVolume);
          break;
      }
    }
  };
}
