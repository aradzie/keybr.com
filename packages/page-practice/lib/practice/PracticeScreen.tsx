import { keyboardProps, KeyboardProvider } from "@keybr/keyboard";
import { type Lesson } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { ResultGroups, useResults } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { loadSounds } from "@keybr/sound";
import { textInputSounds } from "@keybr/textinput-sounds";
import { type ReactNode, useEffect, useRef } from "react";
import { Controller } from "./Controller.tsx";
import {
  type LastLesson,
  makeLastLesson,
  PracticeState,
} from "./practicestate.ts";

export function PracticeScreen({
  onConfigure,
}: {
  readonly onConfigure: () => void;
}): ReactNode {
  return (
    <KeyboardProvider>
      <LessonLoader>
        {(lesson) => (
          <ResultUpdater lesson={lesson} onConfigure={onConfigure} />
        )}
      </LessonLoader>
    </KeyboardProvider>
  );
}

function ResultUpdater({
  lesson,
  onConfigure,
}: {
  readonly lesson: Lesson;
  readonly onConfigure: () => void;
}): ReactNode {
  const { settings } = useSettings();
  const { results, appendResults } = useResults();
  const lastLesson = useRef<LastLesson | null>(null);
  useEffect(() => {
    loadSounds(textInputSounds);
  }, [settings]);
  const group = ResultGroups.byLayoutFamily(results).get(
    settings.get(keyboardProps.layout).family,
  );
  const state = new PracticeState(settings, lesson, group, (result) => {
    if (result.validate()) {
      lastLesson.current = makeLastLesson(result, state.textInput.getSteps());
      appendResults([result]);
    } else {
      appendResults([]); // Forces ui update.
    }
  });
  state.lastLesson = lastLesson.current;
  return <Controller state={state} onConfigure={onConfigure} />;
}
