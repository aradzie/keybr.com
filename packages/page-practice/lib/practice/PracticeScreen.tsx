import { KeyboardContext, loadKeyboard } from "@keybr/keyboard";
import { type Lesson } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { ResultGroups, useResults } from "@keybr/result";
import { type Settings, useSettings } from "@keybr/settings";
import { enableSounds, loadSounds } from "@keybr/sound";
import { textInputSounds } from "@keybr/textinput-sounds";
import { type ReactNode, useEffect } from "react";
import { Controller } from "./Controller.tsx";
import { PracticeState } from "./practicestate.ts";

export function PracticeScreen({
  onConfigure,
}: {
  readonly onConfigure: () => void;
}): ReactNode {
  const { settings } = useSettings();
  const keyboard = loadKeyboard(settings.layout, { full: true });
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
  useEffect(() => {
    loadSounds(textInputSounds);
    enableSounds(settings.sounds);
  }, [settings]);
  const group = ResultGroups.byLayoutFamily(results).get(
    settings.layout.family,
  );
  const state = new PracticeState(settings, lesson, group, (result) => {
    if (result.validate()) {
      appendResults([result]);
    } else {
      appendResults([]); // Forces ui update.
    }
  });
  return <Controller state={state} onConfigure={onConfigure} />;
}
