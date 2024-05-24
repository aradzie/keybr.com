import { catchError } from "@keybr/debug";
import { KeyboardProvider } from "@keybr/keyboard";
import { schedule } from "@keybr/lang";
import { type Lesson } from "@keybr/lesson";
import { LessonLoader } from "@keybr/lesson-loader";
import { LoadingProgress } from "@keybr/pages-shared";
import { type Result, useResults } from "@keybr/result";
import { type Settings, useSettings } from "@keybr/settings";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
  const lastLesson = useRef<LastLesson | null>(null);
  const [progress, { total, current }] = useProgress(settings, lesson, results);
  if (progress == null) {
    return <LoadingProgress total={total} current={current} />;
  }
  const state = new LessonState(progress, (result) => {
    if (result.validate()) {
      progress.append(result, displayEvent);
      lastLesson.current = makeLastLesson(result, state.textInput.getSteps());
      appendResults([result]);
    } else {
      appendResults([]); // Forces UI update.
    }
  });
  state.lastLesson = lastLesson.current;
  return <Controller state={state} onConfigure={onConfigure} />;
}

function useProgress(
  settings: Settings,
  lesson: Lesson,
  results: readonly Result[],
) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState({ total: 0, current: 0 });
  const progress = useMemo(
    () => new Progress(settings, lesson),
    [settings, lesson],
  );
  useEffect(() => {
    // Populating the progress object can take a long time, so we do this
    // asynchronously, interleaved with the browser event loop to avoid
    // freezing of the UI.
    const controller = new AbortController();
    const { signal } = controller;
    schedule(progress.seedAsync(lesson.filter(results), setLoading), { signal })
      .then(() => setDone(true))
      .catch(catchError);
    return () => {
      controller.abort();
    };
  }, [progress, lesson, results]);
  return [done ? progress : null, loading] as const;
}
