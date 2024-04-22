import { booleanProp } from "@keybr/settings";
import { Button, Para, styleTextEnd, useExplainerState } from "@keybr/widget";
import { type ReactNode, useLayoutEffect } from "react";
import { useIntl } from "react-intl";
import { Prefs } from "../prefs.ts";

const propShowExplainers = booleanProp("prefs.settings.showExplainers", true);

export function ExplainSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { explainersVisible, toggleExplainers } = useExplainerState();
  useLayoutEffect(() => {
    toggleExplainers(Prefs.get(propShowExplainers));
  });
  return (
    <Para className={styleTextEnd}>
      <Button
        onClick={() => {
          toggleExplainers(!explainersVisible);
          Prefs.set(propShowExplainers, !explainersVisible);
        }}
      >
        {explainersVisible
          ? `\u25BC ${formatMessage({
              id: "settings.explain.hide",
              defaultMessage: "Hide explanations",
            })}`
          : `\u25BA ${formatMessage({
              id: "settings.explain.show",
              defaultMessage: "Explain settings",
            })}`}
      </Button>
    </Para>
  );
}
