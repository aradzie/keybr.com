import { KeyboardProvider } from "@keybr/keyboard";
import { type Lesson } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { useResults } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { type ReactNode, useMemo, useRef } from "react";
import { Controller } from "./Controller.tsx";
import {
  displayEvent,
  type LastLesson,
  LessonState,
  makeLastLesson,
  Progress,
} from "./state/index.ts";

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
  const progress = useMemo(
    () => new Progress(settings, lesson),
    [settings, lesson],
  );
  const lastLesson = useRef<LastLesson | null>(null);
  progress.seed(lesson.filter(results));
  const state = new LessonState(progress, (result) => {
    if (result.validate()) {
      progress.append(result, displayEvent);
      lastLesson.current = makeLastLesson(result, state.textInput.getSteps());
      appendResults([result]);
    } else {
      appendResults([]); // Forces ui update.
    }
  });
  state.lastLesson = lastLesson.current;
  return <Controller state={state} onConfigure={onConfigure} />;
}
