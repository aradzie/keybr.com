import { type ReactNode } from "react";
import { Para } from "../text/Para.tsx";
import { useExplainerState } from "./context.ts";
import * as styles from "./Explainer.module.less";

export function Explainer({
  children,
}: {
  readonly children?: ReactNode;
}): ReactNode {
  const { explainersVisible } = useExplainerState();
  return explainersVisible && <Para className={styles.root}>{children}</Para>;
}
