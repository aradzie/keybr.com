import {
  KeyboardContext,
  KeyboardOptions,
  keyboardProps,
  loadKeyboard,
} from "@keybr/keyboard";
import { type Lesson } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { ResultGroups, useResults } from "@keybr/result";
import { type Settings, useSettings } from "@keybr/settings";
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
  const { settings } = useSettings();
  const keyboard = loadKeyboard(KeyboardOptions.from(settings));
  return (
    <KeyboardContext.Provider value={keyboard}>
      <LessonLoader>
        {(lesson) => (
          <ResultUpdater
            settings={settings}
            lesson={lesson}
            onConfigure={onConfigure}
          />
        )}
      </LessonLoader>
    </KeyboardContext.Provider>
  );
}

function ResultUpdater({
  settings,
  lesson,
  onConfigure,
}: {
  readonly settings: Settings;
  readonly lesson: Lesson;
  readonly onConfigure: () => void;
}): ReactNode {
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
      lastLesson.current = makeLastLesson(result);
      appendResults([result]);
    } else {
      appendResults([]); // Forces ui update.
    }
  });
  state.lastLesson = lastLesson.current;
  return <Controller state={state} onConfigure={onConfigure} />;
}
