import { booleanProp, Preferences } from "@keybr/settings";
import { Button, Para, styleTextEnd, useExplainerState } from "@keybr/widget";
import { type ReactNode, useLayoutEffect } from "react";
import { useIntl } from "react-intl";

const propExplainSettings = booleanProp("prefs.settings.explain", true);

export function ExplainSettings(): ReactNode {
  const { formatMessage } = useIntl();
  const { explainersVisible, toggleExplainers } = useExplainerState();
  useLayoutEffect(() => {
    toggleExplainers(Preferences.get(propExplainSettings));
  });
  return (
    <Para className={styleTextEnd}>
      <Button
        onClick={() => {
          toggleExplainers(!explainersVisible);
          Preferences.set(propExplainSettings, !explainersVisible);
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
