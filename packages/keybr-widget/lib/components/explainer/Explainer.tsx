import { type ReactNode } from "react";
import { useExplainerState } from "./context.ts";

export function Explainer({
  children,
}: {
  readonly children?: ReactNode;
}): ReactNode {
  const { explainersVisible } = useExplainerState();
  return explainersVisible && children;
}
