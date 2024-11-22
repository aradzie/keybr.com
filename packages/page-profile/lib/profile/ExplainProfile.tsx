import { booleanProp, Preferences } from "@keybr/settings";
import { Button, Field, FieldList, useExplainerState } from "@keybr/widget";
import { useLayoutEffect } from "react";
import { useIntl } from "react-intl";

const propExplainSettings = booleanProp("prefs.profile.explain", true);

export function ExplainProfile() {
  const { formatMessage } = useIntl();
  const { explainersVisible, toggleExplainers } = useExplainerState();
  useLayoutEffect(() => {
    toggleExplainers(Preferences.get(propExplainSettings));
  });
  return (
    <FieldList>
      <Field.Filler />
      <Field>
        <Button
          onClick={() => {
            toggleExplainers(!explainersVisible);
            Preferences.set(propExplainSettings, !explainersVisible);
          }}
        >
          {explainersVisible
            ? `\u25BC ${formatMessage({
                id: "profile.explain.hide",
                defaultMessage: "Hide explanations",
              })}`
            : `\u25BA ${formatMessage({
                id: "profile.explain.show",
                defaultMessage: "Explain charts",
              })}`}
        </Button>
      </Field>
    </FieldList>
  );
}
