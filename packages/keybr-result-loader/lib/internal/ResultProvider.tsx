import { catchError } from "@keybr/debug";
import { type Result, ResultContext } from "@keybr/result";
import { type ReactNode, useState } from "react";
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
        results: results,
        appendResults: (newResults) => {
          storage.append(newResults).catch(catchError);
          setResults([...results, ...newResults]);
        },
        clearResults: () => {
          storage.clear().catch(catchError);
          setResults([]);
        },
      }}
    >
      {children}
    </ResultContext.Provider>
  );
}
