import { type Result, ResultContext } from "@keybr/result";
import { type ReactNode, useState } from "react";
import { catchError } from "./debug.tsx";
import { type ResultStorage } from "./types.ts";

export function ResultProvider({
  storage,
  initialResults,
  children,
}: {
  readonly storage: ResultStorage;
  readonly initialResults: readonly Result[];
  readonly children: ReactNode;
}): ReactNode {
  const [results, setResults] = useState(initialResults);
  return (
    <ResultContext.Provider
      value={{
        results,
        appendResults: (newResults) => {
          setResults([...results, ...newResults]);
          storage.append(newResults).catch(catchError);
        },
        clearResults: () => {
          setResults([]);
          storage.clear().catch(catchError);
        },
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
