import { catchError } from "@keybr/debug";
import { type Language } from "@keybr/keyboard";
import { LoadingProgress } from "@keybr/pages-shared";
import {
  type PhoneticModel,
  PhoneticModelContext,
} from "@keybr/phonetic-model";
import { type ReactNode, useEffect, useState } from "react";
import { loaderImpl } from "./loader.ts";

export function PhoneticModelLoader({
  language,
  children,
  fallback = <LoadingProgress total={0} current={0} />,
}: {
  readonly language: Language;
  readonly children: (result: PhoneticModel) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  return (
    <Loader key={language.id} language={language} fallback={fallback}>
      {children}
    </Loader>
  );
}

export namespace PhoneticModelLoader {
  export let loader: PhoneticModel.Loader = loaderImpl;
}

function Loader({
  language,
  children,
  fallback,
}: {
  readonly language: Language;
  readonly children: (result: PhoneticModel) => ReactNode;
  readonly fallback?: ReactNode;
}): ReactNode {
  const result = useLoader(language);
  if (result == null) {
    return fallback;
  } else {
    return (
      <PhoneticModelContext.Provider value={result}>
        {children(result)}
      </PhoneticModelContext.Provider>
    );
  }
}

function useLoader(language: Language): PhoneticModel | null {
  const [result, setResult] = useState<PhoneticModel | null>(null);

  useEffect(() => {
    let didCancel = false;

    PhoneticModelLoader.loader(language)
      .then((result) => {
        if (!didCancel) {
          setResult(result);
        }
      })
      .catch(catchError);

    return () => {
      didCancel = true;
    };
  }, [language]);

  return result;
}
