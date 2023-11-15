import { loadWordList } from "@keybr/content-words";
import { catchError } from "@keybr/debug";
import { keyboardProps, useKeyboard } from "@keybr/keyboard";
import {
  CustomTextLesson,
  GuidedLesson,
  type Lesson,
  lessonProps,
  LessonType,
  NumbersLesson,
  WordListLesson,
} from "@keybr/lesson";
import { LoadingProgress } from "@keybr/pages-shared";
import { PhoneticModel } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { useSettings } from "@keybr/settings";
import { type ReactNode, useEffect, useState } from "react";

export function LessonLoader({
  children,
  fallback = <LoadingProgress total={0} current={0} />,
}: {
  readonly children: (result: Lesson) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const { settings } = useSettings();
  const lessonType = settings.get(lessonProps.type);
  const layout = settings.get(keyboardProps.layout);
  return (
    <PhoneticModelLoader language={layout.language}>
      {(model) => (
        <Loader key={lessonType.id} model={model} fallback={fallback}>
          {children}
        </Loader>
      )}
    </PhoneticModelLoader>
  );
}

function Loader({
  model,
  children,
  fallback,
}: {
  readonly model: PhoneticModel;
  readonly children: (result: Lesson) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const result = useLoader(model);
  if (result == null) {
    return fallback;
  } else {
    return children(result);
  }
}

function useLoader(model: PhoneticModel): Lesson | null {
  const { settings } = useSettings();
  const keyboard = useKeyboard();
  const [result, setResult] = useState<Lesson | null>(null);

  useEffect(() => {
    let didCancel = false;

    const load = async (): Promise<void> => {
      const codePoints = keyboard.codePoints();
      const newModel = PhoneticModel.restrict(model, codePoints);
      const lessonType = settings.get(lessonProps.type);
      const layout = settings.get(keyboardProps.layout);

      switch (lessonType) {
        case LessonType.GUIDED: {
          const wordList = await loadWordList(layout.language);
          if (!didCancel) {
            setResult(
              new GuidedLesson(settings, newModel, codePoints, wordList),
            );
          }
          break;
        }
        case LessonType.WORDLIST: {
          const wordList = await loadWordList(layout.language);
          if (!didCancel) {
            setResult(
              new WordListLesson(settings, newModel, codePoints, wordList),
            );
          }
          break;
        }
        case LessonType.CUSTOM: {
          if (!didCancel) {
            setResult(new CustomTextLesson(settings, newModel, codePoints));
          }
          break;
        }
        case LessonType.NUMBERS: {
          if (!didCancel) {
            setResult(new NumbersLesson(settings, newModel, codePoints));
          }
          break;
        }
        default:
          throw new Error();
      }
    };

    load().catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [model, settings, keyboard]);

  return result;
}
