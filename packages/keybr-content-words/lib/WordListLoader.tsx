import { type WordList } from "@keybr/content";
import { catchError } from "@keybr/debug";
import { type Language } from "@keybr/keyboard";
import { type ReactNode, useEffect, useState } from "react";
import { loadWordList } from "./load.ts";

export function WordListLoader({
  language,
  children,
  fallback,
}: {
  readonly language: Language;
  readonly children: (result: WordList) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  return (
    <Loader key={language.id} language={language} fallback={fallback}>
      {children}
    </Loader>
  );
}

function Loader({
  language,
  children,
  fallback,
}: {
  readonly language: Language;
  readonly children: (result: WordList) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const result = useLoader(language);
  if (result == null) {
    return fallback;
  } else {
    return children(result);
  }
}

function useLoader(language: Language): WordList | null {
  const [wordList, setWordList] = useState<WordList | null>(null);

  useEffect(() => {
    let didCancel = false;

    loadWordList(language)
      .then((wordList) => {
        if (!didCancel) {
          setWordList(wordList);
        }
      })
      .catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [language]);

  return wordList;
}
