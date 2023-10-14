import { useIntlNumbers } from "@keybr/intl";
import { ResultContext, useResults } from "@keybr/result";
import { Field, FieldList, Range, styleWidthFull } from "@keybr/widget";
import { type ReactNode, useMemo, useState } from "react";
import * as styles from "./debug.module.less";

export function ResultTrimmer({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const q = useMemo(() => new URLSearchParams(window.location.search), []);
  const { results, appendResults, clearResults } = useResults();
  const [length, setLength] = useState(results.length);
  const { formatNumber } = useIntlNumbers();
  if (q.get("debug") !== "true") {
    return children;
  }
  return (
    <ResultContext.Provider
      value={{
        results: results.slice(0, Math.min(length, results.length)),
        appendResults,
        clearResults,
      }}
    >
      <div className={styles.component}>
        <FieldList>
          <Field size="fill">
            <Range
              className={styleWidthFull}
              min={0}
              max={results.length}
              step={1}
              value={length}
              onChange={(value) => {
                setLength(value);
              }}
            />
          </Field>
          <Field>{formatNumber(length)}</Field>
        </FieldList>
      </div>
      {children}
    </ResultContext.Provider>
  );
}
