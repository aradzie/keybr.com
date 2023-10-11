import { booleanProp } from "@keybr/settings";
import { Button, Para, useExplainerState } from "@keybr/widget";
import { type ReactNode, useLayoutEffect } from "react";
import { Prefs } from "../prefs.ts";
import * as styles from "./ExplainSettings.module.less";

const propShowExplainers = booleanProp("prefs.settings.showExplainers", true);

export function ExplainSettings(): ReactNode {
  const { explainersVisible, toggleExplainers } = useExplainerState();
  useLayoutEffect(() => {
    toggleExplainers(Prefs.get(propShowExplainers));
  });
  return (
    <Para className={styles.explainSettings}>
      <Button
        onClick={() => {
          toggleExplainers(!explainersVisible);
          Prefs.set(propShowExplainers, !explainersVisible);
        }}
      >
        {explainersVisible
          ? "\u25BC Hide explanations"
          : "\u25BA Explain settings"}
      </Button>
    </Para>
  );
}
