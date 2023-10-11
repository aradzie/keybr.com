import { type ReactNode, useState } from "react";
import { ExplainerStateContext } from "./context.ts";

export function ExplainerBoundary({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  const [explainersVisible, setExplainersVisible] = useState(true);
  return (
    <ExplainerStateContext.Provider
      value={{
        explainersVisible,
        toggleExplainers: (v) => {
          setExplainersVisible(v ?? !explainersVisible);
        },
      }}
    >
      {children}
    </ExplainerStateContext.Provider>
  );
}
