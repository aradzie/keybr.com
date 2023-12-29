import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import {
  Explainer,
  Field,
  FieldList,
  Range,
  styleWidthWide,
} from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function AlphabetSizeProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.alphabetSize.label"
            defaultMessage="Unlock more letters:"
          />
        </Field>
        <Field>
          <Range
            className={styleWidthWide}
            min={1}
            max={100}
            step={1}
            value={Math.round(
              settings.get(lessonProps.guided.alphabetSize) * 100,
            )}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.guided.alphabetSize, value / 100),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        Manually unlock the remaining letters. Use this option, for example, if
        you are stuck on a difficult letter and want to get past it. We
        recommend using this option sparingly and stick to the algorithm to
        unlock letters for you.
      </Explainer>
    </>
  );
}
