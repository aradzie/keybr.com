import { keyboardProps, KeyboardProvider } from "@keybr/keyboard";
import { type Lesson } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { ResultGroups, useResults } from "@keybr/result";
import { useSettings } from "@keybr/settings";
import { type ReactNode, useRef } from "react";
import { Controller } from "./Controller.tsx";
import { displayEvent, useEvents } from "./events/index.ts";
import { type LastLesson, LessonState, makeLastLesson } from "./state/index.ts";

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
  const events = useEvents(settings, lesson);
  const lastLesson = useRef<LastLesson | null>(null);
  const group = ResultGroups.byLayoutFamily(results).get(
    settings.get(keyboardProps.layout).family,
  );
  events.init(group.slice(events.length));
  const state = new LessonState(settings, lesson, group, (result) => {
    if (result.validate()) {
      lastLesson.current = makeLastLesson(result, state.textInput.getSteps());
      appendResults([result]);
      events.append(result, displayEvent);
    } else {
      appendResults([]); // Forces ui update.
    }
  });
  state.lastLesson = lastLesson.current;
  return <Controller state={state} onConfigure={onConfigure} />;
}
