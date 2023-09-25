import { ResultContext, useResults } from "@keybr/result";
import { Range } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import * as styles from "./debug.module.less";

export function ResultTrimmer({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const { results, appendResults, clearResults } = useResults();
  const [trim, setTrim] = useState(results.length);
  return (
    <ResultContext.Provider
      value={{
        results: results.slice(0, Math.min(trim, results.length)),
        appendResults,
        clearResults,
      }}
    >
      <>
        <div className={styles.component}>
          <Range
            className={styles.range}
            min={0}
            max={results.length}
            step={1}
            value={trim}
            onChange={(value) => {
              setTrim(value);
            }}
          />
          <span className={styles.label}>{trim.toLocaleString()}</span>
        </div>
        {children}
      </>
    </ResultContext.Provider>
  );
}
