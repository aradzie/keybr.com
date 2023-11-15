import { lessonProps } from "@keybr/lesson";
import { useSettings } from "@keybr/settings";
import { CheckBox, Explainer, Field, FieldList } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

export function NaturalWordsProp(): ReactNode {
  const { settings, updateSettings } = useSettings();
  return (
    <>
      <FieldList>
        <Field>
          <FormattedMessage
            id="settings.naturalWords.label"
            description="Widget name."
            defaultMessage="Prefer natural words:"
          />
        </Field>
        <Field>
          <CheckBox
            checked={settings.get(lessonProps.guided.naturalWords)}
            onChange={(value) => {
              updateSettings(
                settings.set(lessonProps.guided.naturalWords, value),
              );
            }}
          />
        </Field>
      </FieldList>
      <Explainer>
        Use the dictionary words as much as possible, and if not many such words
        are available, then use computer-generated pseudo-words. Natural words
        might be easier to type. Pseudo-words offer a much greater variety of
        letter combinations. If this option is enabled, you will see more
        pseudo-words in the beginning, when the letter list is short. However,
        as you unlock few more letters, there is a good chance that only the
        dictionary words will be used.
      </Explainer>
    </>
  );
}
